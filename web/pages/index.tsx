import { useEffect, useState } from 'react';

interface Image {
  id: number;
  fileName: string;
  alias: string | null;
  tags: string[];
  thumbnail: string | null;
  status: string;
}

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(setImages);
  }, []);

  const triggerProcessing = (id: number) => {
    fetch(`/api/images/${id}/process`, { method: 'POST' }).then(() =>
      console.log('Processing triggered')
    );
  };

  const updateMetadata = (id: number, alias: string, tags: string[]) => {
    fetch(`/api/images/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias, tags }),
    })
      .then(res => res.json())
      .then(updated => setImages(images.map(img => (img.id === id ? updated : img))));
  };

  return (
    <div>
      <h1>Image Management</h1>
      <div>
        {images.map(image => (
          <div key={image.id}>
            <img src={image.thumbnail || '/default_thumbnail.png'} alt={image.alias || image.fileName} />
            <div>
              <label>
                Alias:{' '}
                <input
                  type="text"
                  value={image.alias || ''}
                  onChange={e => updateMetadata(image.id, e.target.value, image.tags)}
                />
              </label>
            </div>
            <div>
              <label>
                Tags:{' '}
                <input
                  type="text"
                  value={image.tags.join(',')}
                  onChange={e => updateMetadata(image.id, image.alias || '', e.target.value.split(','))}
                />
              </label>
            </div>
            <div>Status: {image.status}</div>
            <button onClick={() => triggerProcessing(image.id)}>Process Image</button>
          </div>
        ))}
      </div>
    </div>
  );
}
