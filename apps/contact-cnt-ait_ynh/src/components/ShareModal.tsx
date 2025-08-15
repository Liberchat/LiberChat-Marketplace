import React, { useState } from 'react';
import { X, Share2, Copy, Clock, Link } from 'lucide-react';
import { Contact } from '../types';
import { contactService } from '../services/contactService';

interface ShareModalProps {
  contact: Contact;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ contact, onClose }) => {
  const [shareData, setShareData] = useState<{
    shareCode: string;
    expiresAt: string;
    shareUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateShareLink = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await contactService.shareContact(contact.id);
      setShareData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du partage');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Lien copié dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-2 border-red-600">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">
            Partager le contact
          </h2>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-black transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-red-600 rounded-lg p-4 mb-4 border-2 border-black">
            <h3 className="font-bold text-white mb-2">
              {contact.firstName} {contact.lastName}
            </h3>
            <div className="text-sm text-white space-y-1">
              {contact.phone && <div>📞 {contact.phone}</div>}
              {contact.email && <div>📧 {contact.email}</div>}
              {contact.note && <div>📝 {contact.note}</div>}
            </div>
          </div>

          {error && (
            <div className="bg-red-600 border-2 border-black text-white px-4 py-3 rounded-lg mb-4 font-medium">
              {error}
            </div>
          )}

          {!shareData ? (
            <button
              onClick={generateShareLink}
              disabled={loading}
             className="w-full flex items-center justify-center py-3 bg-red-600 text-white border-2 border-black rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {loading ? (
                'Génération...'
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Générer un lien de partage
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-black rounded-lg p-4 border-2 border-red-600">
                <div className="flex items-center text-sm text-white mb-2">
                  <Link className="h-4 w-4 mr-2" />
                  Code de partage
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded px-3 py-2 text-sm text-black font-mono border border-red-600">
                    {shareData.shareCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(shareData.shareCode)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors border border-white"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-white text-sm text-center mt-2">
                  <Clock className="h-4 w-4 mr-1 inline" />
                  Expire le {formatExpiryDate(shareData.expiresAt)}
                </div>
              </div>

              <div className="bg-red-600 border-2 border-black text-white px-4 py-3 rounded-lg text-sm font-medium">
                🚩🏴 Ce code est temporaire et expire dans 30 minutes. Les données partagées sont chiffrées.
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-black text-white border-2 border-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;