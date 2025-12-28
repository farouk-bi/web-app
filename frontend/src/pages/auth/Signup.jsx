import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipaths';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadimage';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';

const Signup = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  //signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = '';


    if (!fullName) {
      setError('Full name !!');
      return;
    }
    if (!password) {
      setError('Password ghalta');
      return;
    }

    setError("");

    //signup api call
    try {

      //block image upload
      if (profileImage) {
        const imgUploadRes = await uploadImage(profileImage);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("Token", token);
        updateUser(response.data);
        //redirect hasb role
        if (role === 'admin') {
          navigate('/admin/dashboard');
        }
        else {
          navigate('/user/dashboard');
        }
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }



  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black '> Create an account </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profileImage} setImage={setProfileImage} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-slate-800">Full Name</label>
              <input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                placeholder="e.g. Yassine Farouk"
                type='text'
                className='input-box'
              />
            </div>

            <div>
              <label className="text-[13px] text-slate-800">Email Address</label>
              <input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="e.g. yassine@example.tn"
                type='email'
                className='input-box'
              />
            </div>

            <div>
              <label className="text-[13px] text-slate-800">Password</label>
              <input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="********"
                type='password'
                className='input-box'
              />
            </div>

            <div>
              <label className="text-[13px] text-slate-800">Admin Invite Token <span className="text-xs text-gray-400 ">(Optional)</span></label>
              <input
                value={adminInviteToken}
                onChange={({ target }) => setAdminInviteToken(target.value)}
                placeholder="6 Digit code"
                type='text'
                className='input-box'
              />
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>SIGNUP</button>
          <p className="text-[13px] text-slate-800 mt-3">Already have an account? <Link to='/login'
            className='font-medium text-primary underline'>Login</Link></p>




        </form>
      </div>
    </AuthLayout>
  )
}

export default Signup 