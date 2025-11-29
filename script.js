// Konstanta & Status
const MAX_N = 10; 
let isGenerating = false;
const memo = {}; // Cache untuk hasil rekursif

/**
 * Fungsi rekursif untuk menghitung semua cara menutupi papan 2xN.
 * Ini adalah solusi berbasis Fibonacci: f(n) = f(n-1) + f(n-2).
 * @param {number} n - Lebar papan (ukuran N).
 * @returns {Array<Array<string>>} Array solusi, di mana setiap solusi adalah array ubin ('V' atau 'H').
 */
const solveTiling = (n) => {
    // Cek cache dulu (Memoization)
    if (n in memo) return memo[n]; 

    // Base Cases
    if (n === 0) return [[]]; // 1 cara (papan kosong)
    if (n < 0) return [];     // 0 cara (tidak mungkin)

    const results = [];
    
    // Opsi 1: Ubin Vertikal (mengurangi lebar N-1)
    const vertSolutions = solveTiling(n - 1);
    vertSolutions.forEach(subSolution => {
        results.push(['V', ...subSolution]);
    });

    // Opsi 2: Dua Ubin Horizontal (mengurangi lebar N-2)
    const horizSolutions = solveTiling(n - 2);
    horizSolutions.forEach(subSolution => {
        // Menggunakan token 'H' untuk mewakili sepasang horizontal
        results.push(['H', ...subSolution]);
    });
    
    // Simpan di cache dan kembalikan
    memo[n] = results;
    return results;
};

/**
 * Mengambil input, menjalankan solusi, dan memperbarui tampilan (UI).
 */
const generateCombinations = () => {
    if(isGenerating) return;

    // Akses DOM menggunakan destructuring untuk kemudahan
    const inputEl = document.getElementById('widthN');
    const errorMsgEl = document.getElementById('errorMsg');
    const containerEl = document.getElementById('resultsContainer');
    const statsTextEl = document.getElementById('statsText');
    
    const n = parseInt(inputEl.value);

    // Validasi Input menggunakan template literal
    if (isNaN(n) || n < 1 || n > MAX_N) {
        errorMsgEl.style.display = 'block';
        errorMsgEl.textContent = `Mohon masukkan angka antara 1 sampai ${MAX_N} demi kenyamanan visual.`;
        return;
    }
    errorMsgEl.style.display = 'none';

    // Reset UI & set status loading
    containerEl.innerHTML = '';
    statsTextEl.classList.remove('visible');
    isGenerating = true;

    // Penundaan kecil (setTimeout) untuk efek visual loading
    setTimeout(() => {
        const solutions = solveTiling(n);
        const total = solutions.length;

        // Update Statistik dengan template literal
        statsTextEl.innerHTML = `Ditemukan <span style="color:var(--primary); font-weight:bold">${total}</span> Kombinasi Unik (Fibonacci)`;
        statsTextEl.classList.add('visible');

        // Render setiap solusi
        solutions.forEach((sol, index) => {
            createCard(sol, index);
        });

        isGenerating = false;
    }, 100);
};

/**
 * Membuat elemen kartu visual (Card) untuk satu solusi tiling.
 * @param {Array<string>} solutionArray - Array yang berisi urutan ubin ('V' atau 'H').
 * @param {number} index - Indeks kombinasi.
 */
const createCard = (solutionArray, index) => {
    const containerEl = document.getElementById('resultsContainer');
    
    // Buat Kartu Utama
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${index * 0.05}s`;

    // Label Kartu
    const label = document.createElement('div');
    label.className = 'card-label';
    label.innerText = `Kombinasi #${index + 1}`;

    // Grid Tiling
    const grid = document.createElement('div');
    grid.className = 'tiling-grid';

    // Iterasi melalui array solusi
    solutionArray.forEach(move => {
        if (move === 'V') {
            // Ubin Vertikal (2x1)
            const tileV = document.createElement('div');
            tileV.className = 'tile tile-v';
            grid.appendChild(tileV);
        } else if (move === 'H') {
            // Sepasang Ubin Horizontal (1x2 + 1x2, bertumpuk)
            const groupH = document.createElement('div');
            groupH.className = 'tile-h-group';
            
            const topH = document.createElement('div');
            topH.className = 'tile tile-h';
            
            const botH = document.createElement('div');
            botH.className = 'tile tile-h';

            groupH.appendChild(topH);
            groupH.appendChild(botH);
            grid.appendChild(groupH);
        }
    });

    // Pemasangan elemen ke DOM
    card.append(label, grid); // Menggunakan append() modern
    containerEl.appendChild(card);
};

/**
 * Mereset input dan tampilan aplikasi ke kondisi awal.
 */
const resetApp = () => {
    // Akses DOM secara langsung (gaya cepat)
    document.getElementById('widthN').value = '4';
    document.getElementById('resultsContainer').innerHTML = '';
    document.getElementById('statsText').classList.remove('visible');
    document.getElementById('errorMsg').style.display = 'none';
};

// --- Inisialisasi Event Listener ---
// Menggunakan event listener DOMContentLoaded atau window.onload

window.onload = () => {
    // Memastikan fungsi-fungsi ini terekspos ke event handler HTML:
    // PENTING: Dalam lingkungan Canvas/Code Editor, fungsi global 
    // seperti generateCombinations dan resetApp harus tersedia secara global
    // untuk dipanggil oleh atribut 'onclick' di HTML.
    
    // Panggil fungsi generate saat dimuat untuk menampilkan hasil default N=4
    generateCombinations(); 
};