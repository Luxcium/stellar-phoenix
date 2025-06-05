import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('basic_image_info')
export class BasicImageInfo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    thumbnailPath: string;

    @Column('text')
    filePath: string;

    @Column('bigint')
    fileSize: number;

    @Column('text')
    hash: string;

    @Column('timestamp with time zone')
    lastAccessed: Date;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @OneToOne(() => ImageMetadata, metadata => metadata.basicInfo)
    metadata: ImageMetadata;

    @OneToMany(() => ImageTag, imageTag => imageTag.image)
    tags: ImageTag[];

    @OneToMany(() => ImageGroup, imageGroup => imageGroup.image)
    groups: ImageGroup[];

    @OneToMany(() => CustomMetadata, customMetadata => customMetadata.image)
    customMetadata: CustomMetadata[];
}

@Entity('image_metadata')
export class ImageMetadata {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int', { nullable: true })
    width: number;

    @Column('int', { nullable: true })
    height: number;

    @Column('text', { nullable: true })
    format: string;

    @Column('text', { nullable: true })
    colorSpace: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @OneToOne(() => BasicImageInfo)
    @JoinColumn()
    basicInfo: BasicImageInfo;
}

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    name: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @OneToMany(() => ImageTag, imageTag => imageTag.tag)
    images: ImageTag[];
}

@Entity('image_tags')
export class ImageTag {
    @ManyToOne(() => BasicImageInfo, image => image.tags)
    @JoinColumn({ name: 'image_id' })
    image: BasicImageInfo;

    @ManyToOne(() => Tag, tag => tag.images)
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;
}

@Entity('semantic_groups')
export class SemanticGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @OneToMany(() => ImageGroup, imageGroup => imageGroup.group)
    images: ImageGroup[];
}

@Entity('image_groups')
export class ImageGroup {
    @ManyToOne(() => BasicImageInfo, image => image.groups)
    @JoinColumn({ name: 'image_id' })
    image: BasicImageInfo;

    @ManyToOne(() => SemanticGroup, group => group.images)
    @JoinColumn({ name: 'group_id' })
    group: SemanticGroup;

    @Column('float')
    confidence: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;
}

@Entity('custom_metadata')
export class CustomMetadata {
    @ManyToOne(() => BasicImageInfo, image => image.customMetadata)
    @JoinColumn({ name: 'image_id' })
    image: BasicImageInfo;

    @Column('text')
    key: string;

    @Column('jsonb')
    value: any;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}

// Memory-efficient image data interface (not stored in database)
export interface ImageData {
    buffer: Buffer;
    analysisResults?: any;
    processingState: 'idle' | 'processing' | 'error';
    dispose(): void;
}
