import React, { useState } from 'react';
import { User, UserPlus, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { User as UserType } from '../types';

interface AuthFormProps {
  onLogin: (user: UserType, token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isLogin
        ? await authService.login(username, password)
        : await authService.register(username, password);

      onLogin(response.user, response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="https://cnt33.fr/wp-content/uploads/2022/10/arton238-930x620.png" 
            alt="CNT-AIT Logo" 
            className="mx-auto h-16 w-auto mb-4"
          />
          <h2 className="mt-6 text-3xl font-bold text-white">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Gestionnaire de contacts solidaire CNT-AIT
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-600 border-2 border-white text-white px-4 py-3 rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border-2 border-red-600 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 pr-10 bg-white border-2 border-red-600 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border-2 border-white text-sm font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                'Chargement...'
              ) : (
                <>
                  {isLogin ? (
                    <User className="h-4 w-4 mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  {isLogin ? 'Se connecter' : 'Créer un compte'}
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-red-400 hover:text-white transition-colors font-medium"
            >
              {isLogin
                ? "Pas encore de compte ? Créer un compte"
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;