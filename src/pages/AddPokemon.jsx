import AddPokemonForm from '../components/AddPokemonForm';

function AddPokemon() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <AddPokemonForm />
      <div className='mt-4'>
        <a
          href='/dashboard'
          className='text-indigo-500 hover:text-indigo-700 font-semibold'
        >
          Back to Dashboard
        </a>
      </div>
      <div className='mt-4'>
        <p className='text-sm text-gray-600'>Powered by PokeAPI</p>
      </div>
    </div>
  );
}

export default AddPokemon;
