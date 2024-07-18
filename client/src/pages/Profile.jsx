import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice'; // Make sure these actions are correctly imported from your redux slice

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      console.log('currentUser', currentUser);
      console.log('formData', formData);
      console.log('currentUser.token', currentUser.token);
      const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${currentUser.token}` // Ensure `currentUser.token` is the correct token
          
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error Image Upload (Image should be less than 2 MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          placeholder='username'
          id='username'
          className='border p-3 rounded-lg'
          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
        />
        <input
          type="email"
          placeholder='email'
          id='email'
          className='border p-3 rounded-lg'
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button
          type='submit'
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
          disabled={filePerc > 0 && filePerc < 100}
        >
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="cursor-pointer text-red-700">Delete account</span>
        <span className="cursor-pointer text-red-700">Sign out</span>
      </div>
    </div>
  );
}
