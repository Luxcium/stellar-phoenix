#!/usr/bin/env node

/**
 * Script de démonstration du pipeline optimisé
 * 
 * Ce script illustre l'utilisation combinée des optimisations:
 * 1. RAM Disk pour les opérations temporaires
 * 2. Streaming des fichiers par chunks
 * 3. Gestion intelligente des workers
 * 4. Extraction accélérée avec libarchive (via processus externe)
 */

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { processFileStream, batchProcessFiles } from './file-streamer.js';
import os from 'os';

// Configuration
const DEFAULT_RAMDISK_PATH = process.env.RAMDISK_PATH || '/tmp/ramdisk';
const CONCURRENCY = Math.max(1, os.cpus().length - 1);

/**
 * Vérifie si un RAM Disk est disponible
 */
function checkRamDisk() {
  if (!fs.existsSync(DEFAULT_RAMDISK_PATH)) {
    console.warn(`⚠️ AVERTISSEMENT: RAM Disk non détecté à ${DEFAULT_RAMDISK_PATH}`);
    console.warn('Pour maximiser les performances, exécutez d\'abord: sudo scripts/setup_ramdisk.sh');
    return false;
  }
  
  console.log(`✅ RAM Disk détecté à ${DEFAULT_RAMDISK_PATH}`);
  return true;
}

/**
 * Vérifie si les dépendances sont installées
 */
function checkDependencies() {
  try {
    // Vérifier si Python est disponible
    execSync('which python3', { stdio: 'ignore' });
    console.log('✅ Python 3 détecté');
    
    // Vérifier si libarchive est installé
    execSync('python3 -c "import libarchive"', { stdio: 'ignore' });
    console.log('✅ Python libarchive-c détecté');
    
    // Vérifier si pigz (parallel gzip) est installé
    try {
      execSync('which pigz', { stdio: 'ignore' });
      console.log('✅ pigz détecté (compression parallèle disponible)');
    } catch {
      console.warn('⚠️ pigz non détecté, utilisation de gzip standard (moins efficace)');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Dépendances manquantes:', err.message);
    console.error('Veuillez installer les dépendances requises:');
    console.error('- Python 3: https://www.python.org/downloads/');
    console.error('- libarchive-c: pip install libarchive-c');
    console.error('- pigz (optionnel): https://zlib.net/pigz/');
    return false;
  }
}

/**
 * Extrait une archive avec libarchive (via le script Python)
 * @param {string} archivePath - Chemin de l'archive à extraire
 * @param {string} destination - Dossier de destination
 */
function extractWithLibarchive(archivePath, destination) {
  console.log(`📦 Extraction de ${path.basename(archivePath)} vers ${destination}...`);
  
  try {
    const cmd = `python3 ${path.join(__dirname, 'extract_with_libarchive.py')} "${archivePath}" "${destination}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Extraction terminée pour ${path.basename(archivePath)}`);
    return true;
  } catch (err) {
    console.error(`❌ Erreur lors de l'extraction de ${path.basename(archivePath)}:`, err.message);
    return false;
  }
}

/**
 * Compresse un fichier ou dossier en utilisant pigz si disponible
 * @param {string} inputPath - Chemin du fichier/dossier à compresser
 * @param {string} outputPath - Chemin du fichier de sortie
 */
function compressWithParallel(inputPath, outputPath) {
  console.log(`🗜️ Compression de ${path.basename(inputPath)}...`);
  
  try {
    // Vérifier si pigz est disponible
    let cmd;
    try {
      execSync('which pigz', { stdio: 'ignore' });
      // Utiliser pigz pour la compression parallèle
      cmd = `tar cf - "${inputPath}" | pigz -p ${CONCURRENCY} > "${outputPath}"`;
    } catch {
      // Fallback à gzip standard
      cmd = `tar czf "${outputPath}" "${inputPath}"`;
    }
    
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Compression terminée: ${path.basename(outputPath)}`);
    return true;
  } catch (err) {
    console.error(`❌ Erreur lors de la compression:`, err.message);
    return false;
  }
}

/**
 * Transforme un fichier texte en streaming avec une fonction de modification
 * @param {string} inputPath - Chemin du fichier d'entrée
 * @param {string} outputPath - Chemin du fichier de sortie
 * @param {Function} transformer - Fonction de transformation (chunk) => transformedChunk
 */
async function transformTextFile(inputPath, outputPath, transformer) {
  console.log(`🔄 Transformation de ${path.basename(inputPath)}...`);
  
  try {
    const result = await processFileStream(inputPath, outputPath, [transformer], { 
      useRamDisk: true, // Utiliser le RAM disk si disponible
      highWaterMark: 64 * 1024 // 64KB chunks
    });
    
    if (result.success) {
      console.log(`✅ Transformation terminée: ${path.basename(outputPath)}`);
      return true;
    } else {
      console.error(`❌ Erreur lors de la transformation:`, result.error);
      return false;
    }
  } catch (err) {
    console.error(`❌ Erreur lors de la transformation:`, err.message);
    return false;
  }
}

/**
 * Traite un batch de fichiers en parallèle avec une limite de concurrence
 * @param {Array<Object>} files - Liste des fichiers à traiter {input, output, transform}
 */
async function processBatchFiles(files) {
  console.log(`🔄 Traitement de ${files.length} fichiers avec ${CONCURRENCY} workers...`);
  
  try {
    const filesConfig = files.map(file => ({
      input: file.input,
      output: file.output,
      transformers: [file.transform]
    }));
    
    const results = await batchProcessFiles(filesConfig, CONCURRENCY, { 
      useRamDisk: true // Utiliser le RAM disk si disponible
    });
    
    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Traitement terminé: ${succeeded} succès, ${failed} échecs`);
    return results;
  } catch (err) {
    console.error(`❌ Erreur lors du traitement batch:`, err.message);
    return [];
  }
}

/**
 * Affiche les instructions d'utilisation
 */
function showUsage() {
  console.log(`
🚀 Pipeline Optimisé - Usage:
----------------------------
Ce script démontre un pipeline optimisé pour le traitement de données avec:
  - RAM Disk pour les opérations temporaires
  - Streaming de fichiers par chunks
  - Gestion intelligente des workers
  - Extraction accélérée avec libarchive

Commands:
  extract <archive> <destination>  Extrait une archive avec libarchive
  compress <input> <output>        Compresse un fichier/dossier avec compression parallèle
  transform <input> <output>       Transforme un fichier texte en streaming
  batch                            Exécute un traitement batch de fichiers de démonstration
  check                            Vérifie les dépendances et la configuration
  
Exemples:
  node optimized-pipeline.js extract archive.zip ./output
  node optimized-pipeline.js compress ./data data.tar.gz
  node optimized-pipeline.js transform input.txt output.txt
  node optimized-pipeline.js batch
  node optimized-pipeline.js check
`);
}

/**
 * Point d'entrée principal
 */
async function main() {
  // Vérifier les arguments
  const args = process.argv.slice(2);
  if (args.length === 0) {
    showUsage();
    return;
  }
  
  // Vérifier le RAM Disk et les dépendances
  const ramDiskAvailable = checkRamDisk();
  const dependenciesInstalled = checkDependencies();
  
  // Afficher un message si le RAM Disk n'est pas disponible
  if (!ramDiskAvailable) {
    console.log('⚠️ Les performances seront sous-optimales sans RAM Disk');
  }
  
  // Exécuter la commande appropriée
  const command = args[0].toLowerCase();
  
  switch (command) {
    case 'extract':
      if (args.length !== 3) {
        console.error('❌ Usage: node optimized-pipeline.js extract <archive> <destination>');
        return;
      }
      if (dependenciesInstalled) {
        extractWithLibarchive(args[1], args[2]);
      }
      break;
      
    case 'compress':
      if (args.length !== 3) {
        console.error('❌ Usage: node optimized-pipeline.js compress <input> <output>');
        return;
      }
      compressWithParallel(args[1], args[2]);
      break;
      
    case 'transform':
      if (args.length !== 3) {
        console.error('❌ Usage: node optimized-pipeline.js transform <input> <output>');
        return;
      }
      await transformTextFile(args[1], args[2], chunk => {
        // Exemple de transformation: convertir en majuscules
        return chunk.toString().toUpperCase();
      });
      break;
      
    case 'batch':
      // Créer des fichiers de démonstration si nécessaires
      const demoDir = path.join(__dirname, 'demo-data');
      if (!fs.existsSync(demoDir)) {
        fs.mkdirSync(demoDir, { recursive: true });
      }
      
      // Créer des fichiers de test
      for (let i = 1; i <= 5; i++) {
        const content = `Fichier de test ${i}\n`.repeat(1000 * i);
        fs.writeFileSync(path.join(demoDir, `test${i}.txt`), content);
      }
      
      // Préparer les tâches de transformation
      const tasks = Array.from({ length: 5 }, (_, i) => {
        const num = i + 1;
        return {
          input: path.join(demoDir, `test${num}.txt`),
          output: path.join(demoDir, `output${num}.txt`),
          transform: chunk => {
            // Simuler une transformation plus ou moins lourde selon la taille du fichier
            const data = chunk.toString();
            return data.toUpperCase().split('').reverse().join('');
          }
        };
      });
      
      // Exécuter le traitement batch
      await processBatchFiles(tasks);
      break;
      
    case 'check':
      // Déjà fait au début
      break;
      
    default:
      console.error(`❌ Commande inconnue: ${command}`);
      showUsage();
      break;
  }
}

// Exécuter le script
main().catch(err => {
  console.error('❌ Erreur globale:', err);
  process.exit(1);
});