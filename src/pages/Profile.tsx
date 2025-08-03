import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Monitor, Sun, Moon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User as UserType, UserSettings } from '../types';
import { useTheme } from '../context/ThemeContext';

export const Profile: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const [user] = useState<UserType>({
    id: '1',
    name: 'Merlin A',
    email: 'merlin.a@btech.christuniversity.in',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    role: 'student',
    joinedAt: new Date('2023-03-15')
  });
  
  const [settings, setSettings] = useState<UserSettings>({
    theme: theme as 'light' | 'dark' | 'system',
    notifications: true,
    emailUpdates: true,
    soundEffects: false,
    language: 'en'
  });
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setSettings({ ...settings, theme: newTheme });
  };
  
  const toggleSetting = (key: keyof UserSettings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-sm hover:bg-blue-600 transition-colors">
                    <User size={16} />
                  </button>
                </div>
                
                <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                
                <div className="mt-6 w-full">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">San Francisco, CA</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Joined {user.joinedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button fullWidth>Edit Profile</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Account Settings" subtitle="Manage your account preferences" />
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Shield size={16} className="mr-2 text-gray-500" />
                    Account Security
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last updated 3 months ago</p>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-factor Authentication</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Bell size={16} className="mr-2 text-gray-500" />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications about your activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications} 
                          onChange={() => toggleSetting('notifications', !settings.notifications)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Updates</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive email about your learning progress</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.emailUpdates} 
                          onChange={() => toggleSetting('emailUpdates', !settings.emailUpdates)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sound Effects</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Play sounds for notifications and achievements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.soundEffects} 
                          onChange={() => toggleSetting('soundEffects', !settings.soundEffects)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Monitor size={16} className="mr-2 text-gray-500" />
                    Appearance
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className={`
                        cursor-pointer rounded-lg border p-3 flex flex-col items-center
                        ${settings.theme === 'light' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'}
                      `}
                      onClick={() => handleThemeChange('light')}
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2">
                        <Sun size={20} className="text-yellow-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                    </div>
                    <div
                      className={`
                        cursor-pointer rounded-lg border p-3 flex flex-col items-center
                        ${settings.theme === 'dark' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'}
                      `}
                      onClick={() => handleThemeChange('dark')}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center mb-2">
                        <Moon size={20} className="text-gray-300" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                    </div>
                    <div
                      className={`
                        cursor-pointer rounded-lg border p-3 flex flex-col items-center
                        ${settings.theme === 'system' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'}
                      `}
                      onClick={() => handleThemeChange('system')}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-white to-gray-900 border border-gray-200 flex items-center justify-center mb-2">
                        <div className="w-5 h-5 bg-white rounded-l-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button fullWidth>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

