import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Bas-URL för ditt API - ändra denna till din Azure-länk vid deployment
    const API_URL = 'http://localhost:3001';

    // Hämtar alla dokument vid start
    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = () => {
        fetch(`${API_URL}/`)
            .then(res => res.json())
            .then(data => setDocs(data))
            .catch(err => console.error("Error fetching docs:", err));
    };

    // Funktion för att initiera ett nytt tomt dokument
    const createNewDoc = () => {
        setSelectedDoc({
            title: "",
            content: ""
        });
    };

    const saveDoc = async (e) => {
        e.preventDefault();
        
        // Om dokumentet har ett _id kör vi update, annars skapar vi ett nytt via POST till /
        const url = selectedDoc._id ? `${API_URL}/update` : `${API_URL}/`;
        
        // Vi mappar fältet '_id' till 'id' för att matcha backendens förväntningar om det behövs
        const payload = {
            id: selectedDoc._id || null,
            title: selectedDoc.title,
            content: selectedDoc.content
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Dokumentet har sparats!");
                fetchDocs(); // Uppdatera listan
                setSelectedDoc(null); // Göm formuläret
            }
        } catch (error) {
            console.error("Error saving document:", error);
            alert("Kunde inte spara dokumentet.");
        }
    };

    return (
        <div className="site-wrapper">
            <header>
                <h1>SSR Editor</h1>
            </header>

            <main className="main" id="main">
                <h2>Dokument</h2>
                
                {/* Knapp för att kunna skapa något när databasen är tom */}
                <button 
                    onClick={createNewDoc} 
                    className="btn-create" 
                    style={{ marginBottom: '20px', padding: '10px' }}
                >
                    + Nytt dokument
                </button>

                <ul>
                    {docs.map(doc => (
                        <li 
                            key={doc._id} 
                            onClick={() => setSelectedDoc(doc)}
                            style={{ cursor: 'pointer', textDecoration: 'underline', marginBottom: '5px' }}
                        >
                            {doc.title || "(Ingen titel)"}
                        </li>
                    ))}
                </ul>

                {/* Formuläret visas bara om ett dokument är valt eller om "Nytt" klickats */}
                {selectedDoc && (
                    <form onSubmit={saveDoc} className="new-doc">
                        <label htmlFor="title">Titel</label>
                        <input 
                            id="title"
                            type="text"
                            placeholder="Ange titel..."
                            value={selectedDoc.title} 
                            onChange={e => setSelectedDoc({...selectedDoc, title: e.target.value})} 
                            required
                        />
                        
                        <label htmlFor="content">Innehåll</label>
                        <textarea 
                            id="content"
                            rows="10"
                            placeholder="Skriv ditt innehåll här..."
                            value={selectedDoc.content} 
                            onChange={e => setSelectedDoc({...selectedDoc, content: e.target.value})} 
                            required
                        />
                        <button type="submit" className="btn-save">Spara ändringar</button>
                        <button type="button" onClick={() => setSelectedDoc(null)}>Avbryt</button>
                    </form>
                )}
            </main>

            <footer>
                <p className="copyright">&copy; Emil Folino</p>
            </footer>
        </div>
    );
}

export default App;