// SettingsProfile.js
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const INITIAL_TEACHER = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  phone: '123-456-7890',
  address: '123 Main St, City, Country',
  qualification: 'Master of Education',
  profilePic: '',
};

const safe = (value) => (value && String(value).trim()) || '-';

const SettingsProfile = () => {
  const [teacherInfo, setTeacherInfo] = useState(INITIAL_TEACHER);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(INITIAL_TEACHER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const EMAIL = INITIAL_TEACHER.email;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/profile?email=${encodeURIComponent(
            EMAIL
          )}`
        );
        if (response.data?.success && response.data.profile) {
          setTeacherInfo(response.data.profile);
          setFormValues((prev) => ({
            ...prev,
            ...response.data.profile,
          }));
        } else {
          toast.error('Failed to load profile');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setFormValues(teacherInfo);
    setIsEditing(true);
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormValues(teacherInfo);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        email: teacherInfo.email || EMAIL,
        name: formValues.name,
        phone: formValues.phone,
        address: formValues.address,
        qualification: formValues.qualification,
        profilePic: formValues.profilePic,
      };

      const response = await axios.put(
        'http://localhost:4000/api/v1/profile',
        payload
      );

      if (response.data?.success && response.data.profile) {
        setTeacherInfo(response.data.profile);
        setFormValues((prev) => ({
          ...prev,
          ...response.data.profile,
        }));
        setIsEditing(false);
        toast.success('Profile saved');
      } else {
        toast.error(response.data?.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = safe(teacherInfo.name).charAt(0).toUpperCase();
  const profilePic = safe(
    isEditing ? formValues.profilePic : teacherInfo.profilePic
  );

  return (
    <section className="flex bg-sky-50 min-h-[calc(100vh-4rem)]">
      {/* Sidebar column */}
      <aside className="w-64 border-r border-sky-100 hidden md:block">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 flex justify-center">
        <div className="w-full max-w-8xl bg-white rounded shadow-md p-6">
          <div className="flex items-center gap-4 mb-4 border-b pb-4">
            <div className="w-16 h-16 rounded-full bg-sky-200 flex items-center justify-center overflow-hidden">
              {profilePic && profilePic !== '-' ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-sky-700">
                  {avatarLetter}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {safe(teacherInfo.name)}
              </h2>
              <p className="text-sm text-slate-500">
                {safe(teacherInfo.email)}
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading profile...</p>
          ) : isEditing ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="block font-medium text-slate-600">Name</span>
                  <input
                    type="text"
                    className="mt-1 w-full border rounded px-2 py-1 text-sm"
                    value={formValues.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </label>

                <label className="text-sm">
                  <span className="block font-medium text-slate-600">Email</span>
                  <input
                    type="email"
                    className="mt-1 w-full border rounded px-2 py-1 text-sm"
                    value={formValues.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </label>

                <label className="text-sm">
                  <span className="block font-medium text-slate-600">Phone</span>
                  <input
                    type="text"
                    className="mt-1 w-full border rounded px-2 py-1 text-sm"
                    value={formValues.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </label>

                <label className="text-sm">
                  <span className="block font-medium text-slate-600">
                    Qualification
                  </span>
                  <input
                    type="text"
                    className="mt-1 w-full border rounded px-2 py-1 text-sm"
                    value={formValues.qualification}
                    onChange={(e) =>
                      handleChange('qualification', e.target.value)
                    }
                  />
                </label>
              </div>

              <label className="text-sm block">
                <span className="block font-medium text-slate-600">Address</span>
                <textarea
                  className="mt-1 w-full border rounded px-2 py-1 text-sm"
                  rows={2}
                  value={formValues.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </label>

              <label className="text-sm block">
                <span className="block font-medium text-slate-600">
                  Profile picture URL
                </span>
                <input
                  type="url"
                  className="mt-1 w-full border rounded px-2 py-1 text-sm"
                  placeholder="https://example.com/avatar.jpg"
                  value={formValues.profilePic}
                  onChange={(e) => handleChange('profilePic', e.target.value)}
                />
              </label>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border text-sm text-slate-700"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-sky-500 text-white text-sm hover:bg-sky-600 transition"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 text-sm">
                <dt className="font-medium text-slate-600">Name:</dt>
                <dd className="text-slate-800">{safe(teacherInfo.name)}</dd>

                <dt className="font-medium text-slate-600">Email:</dt>
                <dd className="text-slate-800">{safe(teacherInfo.email)}</dd>

                <dt className="font-medium text-slate-600">Phone:</dt>
                <dd className="text-slate-800">{safe(teacherInfo.phone)}</dd>

                <dt className="font-medium text-slate-600">Address:</dt>
                <dd className="text-slate-800">{safe(teacherInfo.address)}</dd>

                <dt className="font-medium text-slate-600">Qualification:</dt>
                <dd className="text-slate-800">
                  {safe(teacherInfo.qualification)}
                </dd>

                <dt className="font-medium text-slate-600">Profile picture:</dt>
                <dd className="text-slate-800">
                  {teacherInfo.profilePic && teacherInfo.profilePic.trim()
                    ? teacherInfo.profilePic
                    : '-'}
                </dd>
              </dl>

              <div className="mt-6 text-right">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-sky-500 text-white text-sm hover:bg-sky-600 transition"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default SettingsProfile;
