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
      <div className='flex gap-4 items-baseline w-full max-w-2xl justify-between p-4'>
        <div>
          <h3 className='font-bold '>Dashboard</h3>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className='bg-pink-900 text-white p-2 rounded mt-4 hover:bg-pink-700 transition duration-300 ease-in-out'
          >
            Logout
          </button>
        </div>
      </div>
      <div className='p-4 mt-4 bg-white shadow-md rounded-lg w-full max-w-2xl'>
        <div>
          <h4 className='font-semibold'>Pokémon Table</h4>
          <a
            href='/add-pokemon'
            className='text-indigo-500 hover:text-indigo-700 font-semibold text-sm'
          >
            Add Pokemon
          </a>
          {/*  */}
        </div>

        <table className='min-w-full border-collapse mt-4 '>
          <thead>
            <tr className='bg-gray-100'>
              <th className=' p-2'>ID</th>
              <th className=' p-2'>Name</th>
              <th className=' p-2'>Type</th>
            </tr>
          </thead>
          <tbody>
            {pokemonData.map(({ _id, name, type }) => (
              <tr key={_id}>
                <td className=' p-2'>{_id}</td>
                <td className=' p-2'>{name}</td>
                <td className=' p-2'>{type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
