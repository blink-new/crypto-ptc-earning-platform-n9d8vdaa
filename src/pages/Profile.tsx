import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save } from 'lucide-react';

const avatars = ['🚀', '👑', '💎', '⚡', '🔥', '🦄', '🦊', '🦁'];

const Profile: React.FC = () => {
  const { user, updateProfile } = useUser();
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '🚀');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleSave = async () => {
    await updateProfile(username, avatar);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
          {isEditing ? 'Cancel' : 'Edit Profile'}
          <Edit className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-5xl">
              {avatar}
            </div>
            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1">
                <Edit className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div>
            {isEditing ? (
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-2xl font-bold"
              />
            ) : (
              <h2 className="text-2xl font-bold">{username}</h2>
            )}
            <p className="text-gray-400">Joined on {user ? new Date(parseInt(user.id.split('_')[1])).toLocaleDateString() : ''}</p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Choose your avatar</h3>
            <div className="flex flex-wrap gap-4">
              {avatars.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`w-16 h-16 rounded-full text-3xl flex items-center justify-center transition-transform transform hover:scale-110 ${avatar === a ? 'border-4 border-crypto-orange' : 'bg-gray-700'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </Card>

      {/* More profile details can be added here */}
    </div>
  );
};

export default Profile;