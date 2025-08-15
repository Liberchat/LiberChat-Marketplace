import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contactService } from '../services/contactService';
import { Contact } from '../types';

const SharedContact: React.FC = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    if (shareCode) {
      loadSharedContact(shareCode);
    }
  }, [shareCode]);

  const loadSharedContact = async (code: string) => {
    try {
      const response = await contactService.getSharedContact(code);
      setContact(response.contact);
      setExpiresAt(response.expiresAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Contact non trouvé');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-red-600 text-white p-6 rounded-lg border-2 border-white max-w-md">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Contact non trouvé</div>
      </div>
    );
  }

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="bg-red-600 rounded-lg p-6 border-2 border-white mb-4">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">
            🚩🏴 Contact Partagé CNT-AIT
          </h1>
          
          <div className="bg-white rounded-lg p-4 border-2 border-black">
            <h2 className="text-xl font-bold text-black mb-3">
              {contact.firstName} {contact.lastName}
            </h2>
            
            <div className="space-y-2 text-black">
              {contact.phone && (
                <div className="flex items-center">
                  <span className="font-medium">📞 Téléphone:</span>
                  <span className="ml-2">{contact.phone}</span>
                </div>
              )}
              
              {contact.email && (
                <div className="flex items-center">
                  <span className="font-medium">📧 Email:</span>
                  <span className="ml-2">{contact.email}</span>
                </div>
              )}
              
              {contact.note && (
                <div>
                  <span className="font-medium">📝 Note:</span>
                  <p className="mt-1 text-sm">{contact.note}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-white text-sm text-center mt-4">
            ⏰ Expire le {formatExpiryDate(expiresAt)}
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/"
            className="inline-block bg-white text-black px-6 py-2 rounded-lg border-2 border-red-600 hover:bg-gray-100 transition-colors font-medium"
          >
            Accéder à l'application
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharedContact;