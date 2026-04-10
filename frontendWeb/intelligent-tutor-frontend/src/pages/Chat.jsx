import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiManager } from '../services/ai';
import authService from '../services/auth';

function Chat() {
    // Liste des messages affichés dans la bulle
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Bonjour ! Je suis ton tuteur intelligent. Comment puis-je t'aider aujourd'hui ?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [texteSaisi, setTexteSaisi] = useState('');
    const [ecritureEnCours, setEcritureEnCours] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [idAudioLecture, setIdAudioLecture] = useState(null);
    const [objetAudio, setObjetAudio] = useState(null);

    const finRef = useRef(null);
    const inputFichier = useRef(null);
    const nav = useNavigate();
    const eleve = authService.getCurrentUser();

    // scroll auto vers le bas quand un message arrive
    const scrollVersBas = () => {
        finRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollVersBas();
    }, [messages, ecritureEnCours]);

    // utilitaire pour empiler un message
    const posterMessage = (txt, provenance, extras = []) => {
        const msgUnique = {
            id: String(Date.now()),
            text: txt,
            sender: provenance,
            timestamp: new Date(),
            actions: extras,
        };
        setMessages((p) => [...p, msgUnique]);
    };

    // Gestion de l'envoi du formulaire
    const gererEnvoi = async (e) => {
        if (e) e.preventDefault();
        const msgAEnvoyer = texteSaisi.trim();
        if (!msgAEnvoyer) return;

        setTexteSaisi('');
        posterMessage(msgAEnvoyer, 'user');
        setEcritureEnCours(true);

        try {
            // on reconstruit l'historique pour l'IA
            const historiqueIA = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const res = await aiManager.appelChat(msgAEnvoyer, null, null, historiqueIA);

            let texteIA = res.message || res.response || "Mince, je n'ai pas pu générer de réponse.";
            let btnActions = res.actions || [];

            // Petit check si l'IA renvoie du JSON brute par erreur
            if (typeof texteIA === 'string' && texteIA.startsWith('{')) {
                try {
                    const objetParse = JSON.parse(texteIA);
                    texteIA = objetParse.message || texteIA;
                    if (objetParse.actions) btnActions = objetParse.actions;
                } catch (err) { }
            }

            posterMessage(texteIA, 'ai', btnActions);
        } catch (e) {
            console.error('Erreur Chat:', e);
            posterMessage("Désolé, j'ai eu un petit problème technique sur mon serveur. Reessaie ?", 'ai');
        } finally {
            setEcritureEnCours(false);
        }
    };

    // Lecture audio du message
    const lancerVoix = async (mId, contenu) => {
        if (idAudioLecture === mId && objetAudio) {
            objetAudio.pause();
            setIdAudioLecture(null);
            setObjetAudio(null);
            return;
        }

        try {
            if (objetAudio) objetAudio.pause();
            setIdAudioLecture(mId);

            const result = await aiManager.getAudioLecon(contenu);
            if (result.audio_url) {
                const urlFinale = result.audio_url.startsWith('http') ? result.audio_url : `http://localhost:8000${result.audio_url}`;
                const lecture = new Audio(urlFinale);
                lecture.play();
                setObjetAudio(lecture);
                lecture.onended = () => {
                    setIdAudioLecture(null);
                    setObjetAudio(null);
                };
            }
        } catch (err) {
            console.error('TTS Fail:', err);
            setIdAudioLecture(null);
        }
    };

    // Upload et Scan de photo
    const chargerPhoto = async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;

        setIsScanning(true);
        posterMessage("🔍 Un instant, je regarde ta photo...", 'ai');

        try {
            const lect = new FileReader();
            lect.onloadend = async () => {
                const b64 = lect.result;
                const extraction = await aiManager.scanManuscrit(b64, "Chat OCR");
                if (extraction.extracted_text) {
                    setTexteSaisi(extraction.extracted_text);
                    posterMessage(`J'ai décodé ceci : "${extraction.extracted_text}". Tu veux que je t'explique ?`, 'ai');
                } else {
                    posterMessage("Je n'arrive pas bien à lire. Tu peux reprendre la photo ?", 'ai');
                }
            };
            lect.readAsDataURL(file);
        } catch (e) {
            posterMessage("Problème de connexion pour le scan.", 'ai');
        } finally {
            setIsScanning(false);
        }
    };

    const actionBouton = (item) => {
        if (item.navigate) {
            nav(item.navigate.path || '/dashboard');
        } else if (item.label.includes('cours')) {
            nav('/courses');
        } else {
            nav('/dashboard');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Barre de navigation */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <span className="text-xl">🤖</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">Tuteur Intelligent</h1>
                        <p className="text-xs text-green-500 font-semibold uppercase tracking-wider">En Ligne • {eleve?.level}</p>
                    </div>
                </div>
                <button
                    onClick={() => nav('/dashboard')}
                    className="text-slate-500 hover:text-slate-800 transition-colors font-semibold"
                >
                    Fermer
                </button>
            </header>

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] relative group ${m.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-blue-200 shadow-lg'
                            : 'bg-white text-slate-800 rounded-2xl rounded-tl-none shadow-sm border border-slate-100'
                            } p-4`}>
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.text}</p>

                            {m.sender === 'ai' && (
                                <button
                                    onClick={() => lancerVoix(m.id, m.text)}
                                    className="absolute -right-10 top-2 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    {idAudioLecture === m.id ? '🛑' : '🔊'}
                                </button>
                            )}

                            {m.actions && m.actions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {m.actions.map((bt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => actionBouton(bt)}
                                            className="bg-slate-50 hover:bg-blue-50 border border-blue-200 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                                        >
                                            {bt.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className={`text-[10px] mt-2 opacity-50 ${m.sender === 'user' ? 'text-right' : ''}`}>
                                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {ecritureEnCours && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">Réflexion en cours...</span>
                        </div>
                    </div>
                )}
                <div ref={finRef} />
            </div>

            {/* Zone Saisie */}
            <div className="bg-white border-t border-slate-200 p-4 md:p-6">
                <form onSubmit={gererEnvoi} className="max-w-4xl mx-auto flex items-end gap-3">
                    <button
                        type="button"
                        onClick={() => inputFichier.current.click()}
                        className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all"
                        disabled={isScanning || ecritureEnCours}
                    >
                        <span className="text-xl">📸</span>
                    </button>
                    <input
                        type="file"
                        ref={inputFichier}
                        onChange={chargerPhoto}
                        className="hidden"
                        accept="image/*"
                    />

                    <div className="flex-1 relative">
                        <textarea
                            rows="1"
                            value={texteSaisi}
                            onChange={(e) => setTexteSaisi(e.target.value)}
                            placeholder="Pose ta question ici..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none max-h-32 text-slate-800"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    gererEnvoi(e);
                                }
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!texteSaisi.trim() || ecritureEnCours || isScanning}
                        className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all"
                    >
                        <span className="text-xl">✈️</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
