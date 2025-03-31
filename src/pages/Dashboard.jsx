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
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <h2 className='text-xl font-semibold mt-4'>Pokémon Table</h2>

      <table className='min-w-full border-collapse border border-gray-200 mt-4'>
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

      <button
        onClick={handleLogout}
        className='bg-red-500 text-white p-2 rounded mt-4'
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
