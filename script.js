// file: script.js

class FriendsBirthdayApp {
    constructor() {
        this.friends = [];
        this.lang = 'es';
        this.theme = 'dark';
        this.editingId = null;
        this.maxFriends = 100;
        this.dom = {
            body: document.body,
            themeToggle: document.getElementById('theme-toggle'),
            langToggle: document.getElementById('lang-toggle'),
            form: document.getElementById('friend-form'),
            cancelEdit: document.getElementById('cancel-edit'),
            search: document.getElementById('search-input'),
            sort: document.getElementById('sort-select'),
            container: document.getElementById('friends-container'),
            noFriends: document.getElementById('no-friends'),
            exportBtn: document.getElementById('export-btn'),
            importBtn: document.getElementById('import-btn'),
            importFile: document.getElementById('import-file')
        };
        this.translations = {
            es: {
                title: 'Cumpleaños de Amigos', appTitle: 'Cumpleaños de Amigos', toggleTheme: 'Cambiar tema', langToggle: 'English',
                addFriend: 'Agregar Amigo', name: 'Nombre:', day: 'Día:', month: 'Mes:', year: 'Año:', selectDay: '--Día--',
                selectMonth: '--Mes--', add: 'Agregar', cancel: 'Cancelar', edit: 'Editar', delete: 'Eliminar',
                searchPlaceholder: 'Buscar amigos...', sortName: 'Ordenar por Nombre', sortAge: 'Ordenar por Edad',
                sortNextBirthday: 'Próximo Cumpleaños', friendsList: 'Lista de Amigos', noFriends: 'No hay amigos agregados aún.',
                yearsOld: 'años', monthsOld: 'meses', daysOld: 'días', nextBirthday: 'Próximo cumpleaños:', today: 'hoy',
                in: 'en', months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
                editFriend: 'Editar Amigo', update: 'Actualizar', born: 'Nacido:', age: 'Edad:', monthlyAge: 'meses, próximo mes:', on: 'el',
                export: 'Exportar Datos', import: 'Importar Datos', exportSuccess: 'Datos exportados exitosamente', 
                importSuccess: 'Datos importados exitosamente', importError: 'Error al importar datos', invalidFile: 'Archivo inválido'
            },
            en: {
                title: 'Friends Birthdays', appTitle: 'Friends Birthdays', toggleTheme: 'Toggle theme', langToggle: 'Español',
                addFriend: 'Add Friend', name: 'Name:', day: 'Day:', month: 'Month:', year: 'Year:', selectDay: '--Day--',
                selectMonth: '--Month--', add: 'Add', cancel: 'Cancel', edit: 'Edit', delete: 'Delete',
                searchPlaceholder: 'Search friends...', sortName: 'Sort by Name', sortAge: 'Sort by Age',
                sortNextBirthday: 'Next Birthday', friendsList: 'Friends List', noFriends: 'No friends added yet.',
                yearsOld: 'years', monthsOld: 'months', daysOld: 'days', nextBirthday: 'Next birthday:', today: 'today',
                in: 'in', months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                editFriend: 'Edit Friend', update: 'Update', born: 'Born:', age: 'Age:', monthlyAge: 'months, next month:', on: 'on',
                export: 'Export Data', import: 'Import Data', exportSuccess: 'Data exported successfully', 
                importSuccess: 'Data imported successfully', importError: 'Error importing data', invalidFile: 'Invalid file'
            }
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.loadFriends();
        this.dom.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.dom.langToggle.addEventListener('click', () => this.toggleLanguage());
        this.dom.form.addEventListener('submit', e => this.handleFormSubmit(e));
        this.dom.cancelEdit.addEventListener('click', () => this.cancelEdit());
        this.dom.search.addEventListener('input', e => this.handleSearch(e.target.value));
        this.dom.sort.addEventListener('change', e => this.handleSort(e.target.value));
        this.dom.exportBtn.addEventListener('click', () => this.exportData());
        this.dom.importBtn.addEventListener('click', () => this.dom.importFile.click());
        this.dom.importFile.addEventListener('change', e => this.importData(e));
        this.populateSelects();
        this.updateLanguage();
        this.renderFriends();
    }

    storage(key, data, load = false) {
        return load
            ? (localStorage.getItem(key) ? JSON.parse(atob(localStorage.getItem(key))) : data)
            : localStorage.setItem(key, btoa(JSON.stringify(data)));
    }

    loadSettings() {
        this.lang = this.storage('friendsApp_lang', 'es', true);
        this.theme = this.storage('friendsApp_theme', 'dark', true);
        this.dom.body.className = `${this.theme}-theme`;
    }

    loadFriends() {
        this.friends = this.storage('friendsApp_friends', [], true);
    }

    saveSettings() {
        this.storage('friendsApp_lang', this.lang);
        this.storage('friendsApp_theme', this.theme);
    }

    saveFriends() {
        this.storage('friendsApp_friends', this.friends);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.dom.body.className = `${this.theme}-theme`;
        this.dom.themeToggle.textContent = this.theme === 'dark' ? '🌙' : '☀️';
        this.saveSettings();
    }

    toggleLanguage() {
        const beforeText = this.dom.langToggle.textContent;
        console.log('Language toggle clicked - Before:', beforeText);
        
        this.lang = this.lang === 'es' ? 'en' : 'es';
        this.updateLanguage();
        
        const afterText = this.dom.langToggle.textContent;
        console.log('Language toggle clicked - After:', afterText);
        console.log('Language changed to:', this.lang);
        
        this.populateSelects();
        this.renderFriends();
        this.saveSettings();
    }

    updateLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const newText = this.translations[this.lang][key];
            if (newText) {
                el.textContent = newText;
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const newPlaceholder = this.translations[this.lang][key];
            if (newPlaceholder) {
                el.placeholder = newPlaceholder;
            }
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const newTitle = this.translations[this.lang][key];
            if (newTitle) {
                el.title = newTitle;
            }
        });
        document.title = this.translations[this.lang].title;
    }

    populateSelects() {
        const daySelect = document.getElementById('birth-day');
        const monthSelect = document.getElementById('birth-month');
        daySelect.innerHTML = `<option value="">${this.translations[this.lang].selectDay}</option>` +
            Array.from({length: 31}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
        monthSelect.innerHTML = `<option value="">${this.translations[this.lang].selectMonth}</option>` +
            this.translations[this.lang].months.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('');
    }

    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return { years, months, days };
    }

    calculateMonthlyAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        const age = this.calculateAge(birthDate);
        let totalMonths = age.years * 12 + age.months;
        const nextMonthDate = new Date(birth);
        nextMonthDate.setMonth(birth.getMonth() + totalMonths + 1);
        return { totalMonths, nextMonthDate };
    }

    calculateNextBirthday(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBirthday < today) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        const daysDiff = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        const upcomingAge = nextBirthday.getFullYear() - birth.getFullYear();
        if (daysDiff === 0) return { isToday: true, days: 0, months: 0, upcomingAge };
        let months = Math.floor(daysDiff / 30);
        let days = daysDiff % 30;
        return { isToday: false, days, months, upcomingAge };
    }

    formatBirthDate(day, month, year) {
        const months = this.translations[this.lang].months;
        return this.lang === 'es' ? `${day} de ${months[month - 1]} de ${year}` : `${months[month - 1]} ${day}, ${year}`;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        if (this.friends.length >= this.maxFriends && !this.editingId) return alert(`Maximum ${this.maxFriends} friends allowed.`);
        const [name, day, month, year] = ['friend-name', 'birth-day', 'birth-month', 'birth-year'].map(id => document.getElementById(id).value.trim());
        if (!name || !day || !month || !year) return;
        const birthDate = new Date(+year, +month - 1, +day);
        if (birthDate > new Date()) return alert('Birth date cannot be in the future.');
        const friend = { id: this.editingId || Date.now(), name, day: +day, month: +month, year: +year, birthDate: birthDate.toISOString() };
        if (this.editingId) {
            const index = this.friends.findIndex(f => f.id === this.editingId);
            if (index !== -1) this.friends[index] = friend;
            this.cancelEdit();
        } else {
            this.friends.push(friend);
        }
        this.saveFriends();
        this.renderFriends();
        this.dom.form.reset();
    }

    editFriend(id) {
        const friend = this.friends.find(f => f.id === id);
        if (!friend) return;
        ['friend-name', 'birth-day', 'birth-month', 'birth-year'].forEach((id, i) => 
            document.getElementById(id).value = [friend.name, friend.day, friend.month, friend.year][i]);
        this.editingId = id;
        document.querySelector('[data-i18n="add-friend"]').textContent = this.translations[this.lang].editFriend;
        document.querySelector('button[type="submit"]').textContent = this.translations[this.lang].update;
        this.dom.cancelEdit.classList.remove('hidden');
    }

    cancelEdit() {
        this.editingId = null;
        document.querySelector('[data-i18n="add-friend"]').textContent = this.translations[this.lang].addFriend;
        document.querySelector('button[type="submit"]').textContent = this.translations[this.lang].add;
        this.dom.cancelEdit.classList.add('hidden');
        this.dom.form.reset();
    }

    deleteFriend(id) {
        if (confirm('Are you sure you want to delete this friend?')) {
            this.friends = this.friends.filter(f => f.id !== id);
            this.saveFriends();
            this.renderFriends();
        }
    }

    handleSearch(query) {
        this.renderFriends(query);
    }

    handleSort(sortBy) {
        this.renderFriends(this.dom.search.value, sortBy);
    }

    renderFriends(searchQuery = '', sortBy = 'name') {
        const friends = searchQuery 
            ? this.friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())) 
            : this.friends;
        if (!friends.length) {
            if (this.dom.noFriends) {
                this.dom.noFriends.style.display = 'block';
                this.dom.container.innerHTML = '';
                this.dom.container.appendChild(this.dom.noFriends);
            } else {
                this.dom.container.innerHTML = '<p class="no-data">No hay amigos agregados aún.</p>';
            }
            return;
        }
        if (this.dom.noFriends) this.dom.noFriends.style.display = 'none';
        friends.sort((a, b) => {
            if (sortBy === 'age') {
                const ageA = this.calculateAge(a.birthDate), ageB = this.calculateAge(b.birthDate);
                return (ageB.years * 365 + ageB.months * 30 + ageB.days) - (ageA.years * 365 + ageA.months * 30 + ageA.days);
            }
            if (sortBy === 'next-birthday') {
                const nextA = this.calculateNextBirthday(a.birthDate), nextB = this.calculateNextBirthday(b.birthDate);
                return (nextA.months * 30 + nextA.days) - (nextB.months * 30 + nextB.days);
            }
            return a.name.localeCompare(b.name);
        });
        this.dom.container.innerHTML = friends.map(f => {
            const age = this.calculateAge(f.birthDate);
            const next = this.calculateNextBirthday(f.birthDate);
            const birthDateStr = this.formatBirthDate(f.day, f.month, f.year);
            const monthly = age.years < 3 ? this.calculateMonthlyAge(f.birthDate) : null;
            const nextStr = next.isToday ? this.translations[this.lang].today : 
                `${next.upcomingAge} ${this.translations[this.lang].yearsOld} ${this.translations[this.lang].in} ${[next.months > 0 ? `${next.months} ${this.translations[this.lang].monthsOld}` : '', next.days > 0 ? `${next.days} ${this.translations[this.lang].daysOld}` : ''].filter(Boolean).join(', ')}`;
            return `
                <div class="friend-item">
                    <div class="friend-info">
                        <h3>${f.name}</h3>
                        <div class="friend-details">
                            <div>${this.translations[this.lang].born} ${birthDateStr} - ${this.translations[this.lang].age} ${age.years} ${this.translations[this.lang].yearsOld}, ${age.months} ${this.translations[this.lang].monthsOld}, ${age.days} ${this.translations[this.lang].daysOld}</div>
                            ${monthly ? `<div class="monthly-age">${monthly.totalMonths + 1} ${this.translations[this.lang].monthlyAge} ${this.translations[this.lang].on} ${this.formatBirthDate(monthly.nextMonthDate.getDate(), monthly.nextMonthDate.getMonth() + 1, monthly.nextMonthDate.getFullYear())}</div>` : ''}
                            <div class="next-birthday">${this.translations[this.lang].nextBirthday} ${nextStr}</div>
                        </div>
                    </div>
                    <div class="friend-actions">
                        <button class="btn-edit" onclick="app.editFriend(${f.id})">${this.translations[this.lang].edit}</button>
                        <button class="btn-danger" onclick="app.deleteFriend(${f.id})">${this.translations[this.lang].delete}</button>
                    </div>
                </div>`;
        }).join('');
    }

    exportData() {
        try {
            const exportData = {
                friends: this.friends,
                settings: {
                    lang: this.lang,
                    theme: this.theme
                },
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `cumpleanos-amigos-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            alert(this.translations[this.lang].exportSuccess);
        } catch (error) {
            console.error('Export error:', error);
            alert(this.translations[this.lang].importError);
        }
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (!importData.friends || !Array.isArray(importData.friends)) {
                    throw new Error('Invalid file format');
                }
                
                if (confirm(`${this.translations[this.lang].importSuccess}?\n${importData.friends.length} ${this.translations[this.lang].friendsList.toLowerCase()}`)) {
                    this.friends = importData.friends;
                    
                    if (importData.settings) {
                        if (importData.settings.lang && ['es', 'en'].includes(importData.settings.lang)) {
                            this.lang = importData.settings.lang;
                        }
                        if (importData.settings.theme && ['light', 'dark'].includes(importData.settings.theme)) {
                            this.theme = importData.settings.theme;
                            this.dom.body.className = `${this.theme}-theme`;
                            this.dom.themeToggle.textContent = this.theme === 'dark' ? '🌙' : '☀️';
                        }
                    }
                    
                    this.saveSettings();
                    this.saveFriends();
                    this.updateLanguage();
                    this.populateSelects();
                    this.renderFriends();
                    
                    alert(this.translations[this.lang].importSuccess);
                }
            } catch (error) {
                console.error('Import error:', error);
                alert(this.translations[this.lang].invalidFile);
            }
        };
        
        reader.readAsText(file);
        event.target.value = '';
    }
}

const app = new FriendsBirthdayApp();