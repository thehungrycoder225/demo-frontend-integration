// src/pages/Dashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import { logout } from '../api/auth';
import api from '../api/apiService';

const Dashboard = () => {
  const [pokemonData, setPokemonData] = useState([]);

  const fetchPokemonData = useCallback(async () => {
    try {
      const { data } = await api.get('v1/pokemons');
      setPokemonData(data);
      console.log('Pokemon data:', data);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  }, []);

  useEffect(() => {
    fetchPokemonData();
  }, [fetchPokemonData]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='grid grid-cols-3 gap-4 p-4 bg-white justify-center items-center'>
        <h3 className='font-bold'>Dashboard</h3>
        <h4 className='font-semibold'>Pokémon Table</h4>
        <button
          onClick={handleLogout}
          className='bg-pink-900 text-white p-2 rounded mt-4'
        >
          Logout
        </button>
      </div>
      <div className='p-4 mt-4 bg-white shadow-md rounded-lg w-full max-w-2xl'>
        <table className='min-w-full border-collapse border border-gray-200 mt-4 '>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-200 p-2'>ID</th>
              <th className='border border-gray-200 p-2'>Name</th>
              <th className='border border-gray-200 p-2'>Type</th>
            </tr>
          </thead>
          <tbody>
            {pokemonData.map(({ _id, name, type }) => (
              <tr key={_id}>
                <td className='border border-gray-200 p-2'>{_id}</td>
                <td className='border border-gray-200 p-2'>{name}</td>
                <td className='border border-gray-200 p-2'>{type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
