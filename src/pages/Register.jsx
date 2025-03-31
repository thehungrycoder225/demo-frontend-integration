import RegisterForm from '../components/RegisterForm';

function Register() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 shadow-md'>
      <h1 className='text-2xl font-bold mb-4'>Register</h1>
      <RegisterForm />
      <p className='mt-4'>
        Already have an account?{' '}
        <a href='/login' className='text-indigo-900-500 hover:underline'>
          Login here
        </a>
      </p>
    </div>
  );
}

export default Register;
