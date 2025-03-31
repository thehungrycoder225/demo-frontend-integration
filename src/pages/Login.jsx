import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      <LoginForm />
      <p className='mt-4'>
        Don't have an account?{' '}
        <a href='/register' className='text-indigo-900-500 hover:underline'>
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;
