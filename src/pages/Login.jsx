import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-6'>Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
