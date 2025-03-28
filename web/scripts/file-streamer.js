/**
 * Module de streaming optimisé pour traiter des fichiers volumineux par chunks
 * plutôt que de les charger entièrement en mémoire.
 * 
 * Ce module permet de:
 * 1. Lire des fichiers par chunks pour économiser la mémoire
 * 2. Traiter chaque chunk individuellement
 * 3. Chaîner des transformations (pipeline)
 * 4. Écrire le résultat en streaming
 */

import fs from 'fs';
import path from 'path';
import { Transform, pipeline } from 'stream';
import { promisify } from 'util';
import os from 'os';

// Promisify pipeline pour utiliser async/await
const pipelineAsync = promisify(pipeline);

// Configuration par défaut
const DEFAULT_CHUNK_SIZE = 64 * 1024; // 64KB
const DEFAULT_RAMDISK_PATH = process.env.RAMDISK_PATH || '/tmp/ramdisk';

/**
 * Transforme un stream en appliquant une fonction à chaque chunk
 * @param {Function} transformFn - Fonction de transformation (chunk) => transformedChunk
 * @returns {Transform} Stream de transformation
 */
function createTransformer(transformFn) {
  return new Transform({
    transform(chunk, encoding, callback) {
      try {
        // Applique la fonction de transformation au chunk
        const result = transformFn(chunk);
        callback(null, result);
      } catch (err) {
        callback(err);
      }
    }
  });
}

/**
 * Traite un fichier en streaming avec une série de transformations
 * @param {string} inputPath - Chemin du fichier d'entrée
 * @param {string} outputPath - Chemin du fichier de sortie
 * @param {Array<Function>} transformers - Fonctions de transformation à appliquer
 * @param {Object} options - Options de configuration
 * @returns {Promise<void>}
 */
async function processFileStream(inputPath, outputPath, transformers = [], options = {}) {
  const { highWaterMark = DEFAULT_CHUNK_SIZE } = options;
  
  // Créer les transformers
  const transformStreams = transformers.map(fn => createTransformer(fn));
  
  // Utiliser le RAM disk si disponible
  let finalOutputPath = outputPath;
  if (options.useRamDisk && fs.existsSync(DEFAULT_RAMDISK_PATH)) {
    const fileName = path.basename(outputPath);
    finalOutputPath = path.join(DEFAULT_RAMDISK_PATH, fileName);
  }
  
  try {
    // Créer le pipeline: source -> transformations -> destination
    const source = fs.createReadStream(inputPath, { highWaterMark });
    const destination = fs.createWriteStream(finalOutputPath);
    
    await pipelineAsync(
      source,
      ...transformStreams,
      destination
    );
    
    // Si on a utilisé le RAM disk, copier le fichier à sa destination finale
    if (finalOutputPath !== outputPath) {
      await pipelineAsync(
        fs.createReadStream(finalOutputPath),
        fs.createWriteStream(outputPath)
      );
      // Nettoyer le fichier temporaire
      fs.unlinkSync(finalOutputPath);
    }
    
    return { success: true, path: outputPath };
  } catch (err) {
    return { 
      success: false, 
      error: err.message,
      path: outputPath
    };
  }
}

/**
 * Traite plusieurs fichiers en parallèle mais avec une limite de concurrence
 * @param {Array<Object>} files - Liste de fichiers à traiter {input, output, transformers}
 * @param {number} concurrency - Nombre de fichiers à traiter en parallèle
 * @param {Object} options - Options de configuration
 * @returns {Promise<Array>} Résultats des traitements
 */
async function batchProcessFiles(files, concurrency = 4, options = {}) {
  const results = [];
  const pending = [...files];
  const running = [];
  
  // Déterminer le niveau de concurrence optimal (nombre de CPU - 1)
  const cpuCount = os.cpus().length;
  const optimalConcurrency = Math.max(1, cpuCount - 1);
  
  // Utiliser la concurrence optimale si non spécifiée
  concurrency = concurrency || optimalConcurrency;
  
  // Fonction pour traiter le prochain fichier dans la file
  const processNext = async () => {
    if (pending.length === 0) return null;
    
    // Prendre le prochain fichier à traiter
    const { input, output, transformers } = pending.shift();
    
    // Traiter le fichier et capturer le résultat
    const result = await processFileStream(input, output, transformers, options);
    results.push(result);
    
    return result;
  };
  
  // Démarrer le traitement initial jusqu'à concurrence
  while (running.length < concurrency && pending.length > 0) {
    const promise = processNext().then(() => {
      // Retirer de la liste des tâches en cours
      const index = running.indexOf(promise);
      if (index !== -1) running.splice(index, 1);
      
      // Ajouter une nouvelle tâche si disponible
      if (pending.length > 0) {
        const newPromise = processNext();
        if (newPromise) running.push(newPromise);
      }
    });
    
    running.push(promise);
  }
  
  // Attendre que toutes les tâches soient terminées
  await Promise.all(running);
  return results;
}

export { processFileStream, batchProcessFiles, createTransformer };