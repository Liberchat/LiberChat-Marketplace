import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { contactService } from '../services/contactService';
import { Contact } from '../types';

interface ShareCodeInputProps {
  onContactFound: (contact: Contact, expiresAt: string) => void;
}

const ShareCodeInput: React.FC<ShareCodeInputProps> = ({ onContactFound }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await contactService.getSharedContact(code.trim());
      onContactFound(response.contact, response.expiresAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-600 rounded-lg p-6 border-2 border-white mb-6">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        🚩🏴 Accéder avec un code de partage
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Entrez le code de partage..."
            className="w-full px-4 py-3 rounded-lg border-2 border-black text-black font-mono text-center"
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="bg-black text-white p-3 rounded-lg border border-white text-center">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full flex items-center justify-center py-3 bg-black text-white border-2 border-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        >
          {loading ? (
            'Recherche...'
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Accéder au contact
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ShareCodeInput;