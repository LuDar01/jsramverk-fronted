import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/')
            .then(res => res.json())
            .then(data => setDocs(data));
    }, []);

    const saveDoc = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:3001/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedDoc._id,
                title: selectedDoc.title,
                content: selectedDoc.content
            })
        });
        alert("Sparat!");
    };

    return (
        <div className="site-wrapper">
            {/* Motsvarar header.ejs */}
            <header>
                <h1>SSR Editor</h1>
            </header>

            {/* Motsvarar början på header.ejs fram till main-taggen */}
            <main className="main" id="main">
                <h2>Dokument</h2>
                
                <ul>
                    {docs.map(doc => (
                        <li key={doc._id} onClick={() => setSelectedDoc(doc)}>
                            {doc.title}
                        </li>
                    ))}
                </ul>

                {selectedDoc && (
                    <form onSubmit={saveDoc} className="new-doc">
                        <label htmlFor="title">Titel</label>
                        <input 
                            id="title"
                            value={selectedDoc.title} 
                            onChange={e => setSelectedDoc({...selectedDoc, title: e.target.value})} 
                        />
                        
                        <label htmlFor="content">Innehåll</label>
                        <textarea 
                            id="content"
                            rows="10"
                            value={selectedDoc.content} 
                            onChange={e => setSelectedDoc({...selectedDoc, content: e.target.value})} 
                        />
                        <button type="submit">Spara ändringar</button>
                    </form>
                )}
            </main>

            {/* Motsvarar footer.ejs */}
            <footer>
                <p className="copyright">&copy; Emil Folino</p>
            </footer>
        </div>
    );
}

export default App;