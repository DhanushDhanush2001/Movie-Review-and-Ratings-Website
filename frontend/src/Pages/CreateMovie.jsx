import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../axios/axiosInstance';

const CreateMovie = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 👈 Spinner state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genre', genre);
    formData.append('releaseDate', releaseDate);
    formData.append('image', file);

    try {
      await axiosInstance.post('/api/movie/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Movie created successfully!');
    } catch (error) {
      console.error('Error creating movie:', error.message);
      toast.error('Failed to create movie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-grey">Create New Movie</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-white text-grey rounded-md"
          required
        />
        <textarea
          placeholder="Movie Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-white text-grey rounded-md"
          rows="4"
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-2 bg-white text-grey rounded-md"
          required
        />
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="w-full p-2 bg-white text-grey rounded-md"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 bg-white-800 text-grey rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-grey py-2 rounded-md disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isLoading ? 'Creating...' : 'Create Movie'}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
