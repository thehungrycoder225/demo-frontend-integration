import React, { useState } from 'react';
import api from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AddPokemonForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    level: '',
    hp: '',
    attack: '',
    defense: '',
    spAtk: '',
    spDef: '',
    speed: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (Object.values(formData).some((val) => val === '')) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await api.post('v1/pokemons', formData); // Adjust API endpoint as needed
      if (response.success) {
        setSubmitted(true);
        toast.success('Pokemon added successfully!');
        setFormData({
          name: '',
          type: '',
          level: '',
          hp: '',
          attack: '',
          defense: '',
          spAtk: '',
          spDef: '',
          speed: '',
        });
        setTimeout(() => setSubmitted(false), 2000); // Reset animation after 2 seconds
      } else {
        toast.error('Failed to add Pokemon. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const renderInputField = (id, label, type = 'text') => (
    <div className='mb-4'>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        required
      />
    </div>
  );

  return (
    <div className='flex justify-center items-center'>
      <Toaster position='top-center' reverseOrder={false} />
      {/* Add a toast container for notifications */}
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-6 rounded-lg shadow-md w-80 transform transition-all duration-500 ${
          submitted ? 'scale-105' : 'scale-100'
        }`}
      >
        <h2 className='text-2xl font-bold mb-4 text-center'>Add Pokemon</h2>
        {renderInputField('name', 'Name')}
        {renderInputField('type', 'Type')}
        {renderInputField('level', 'Level', 'number')}
        {renderInputField('hp', 'HP', 'number')}
        {renderInputField('attack', 'Attack', 'number')}
        {renderInputField('defense', 'Defense', 'number')}
        {renderInputField('spAtk', 'Special Attack', 'number')}
        {renderInputField('spDef', 'Special Defense', 'number')}
        {renderInputField('speed', 'Speed', 'number')}

        <button
          type='submit'
          className='w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        >
          Add Pokemon
        </button>
        {submitted && (
          <p className='mt-4 text-green-500 text-center animate-bounce'>
            Pokemon Added!
          </p>
        )}
      </form>
      {/* Return to Dashboard */}
    </div>
  );
};

export default AddPokemonForm;
