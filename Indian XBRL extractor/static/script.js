let currentData = [];
let activeFilters = {
    year: 'all',
    indicators: new Set() // Empty set means "All"
};

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.input-group').forEach(grp => grp.classList.remove('active'));

    if (tab === 'url') {
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
        document.getElementById('url-input-group').classList.add('active');
    } else {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('file-input-group').classList.add('active');
    }
}

function handleFileSelect(input) {
    const fileName = input.files[0]?.name;
    document.getElementById('file-name-display').innerText = fileName || "";
}

async function processUrl() {
    const url = document.getElementById('url-input').value;
    if (!url) return alert("Please enter a URL");

    setLoading(true);

    const formData = new FormData();
    formData.append('url', url);

    try {
        const response = await fetch('/api/extract-url', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        renderResults(data);
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        setLoading(false);
    }
}

async function processFile() {
    const fileInput = document.getElementById('file-upload');
    if (!fileInput.files[0]) return alert("Please select a file");

    setLoading(true);

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/api/extract-file', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        renderResults(data);
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    const loader = document.getElementById('loader');
    const results = document.getElementById('results');

    if (isLoading) {
        loader.classList.add('active');
        results.classList.remove('active');
    } else {
        loader.classList.remove('active');
    }
}

function renderResults(data) {
    currentData = data;
    const resultsSection = document.getElementById('results');

    if (!data || data.length === 0) {
        alert("No ESG metrics found.");
        return;
    }

    // Populate Filters
    populateFilters(data);

    // Apply Filters (Initial Render)
    applyFilters();

    resultsSection.classList.add('active');
}

function populateFilters(data) {
    // Unique Years
    const years = [...new Set(data.map(item => item.reporting_year))].sort((a, b) => b - a);
    const yearSelect = document.getElementById('year-filter');
    yearSelect.innerHTML = '<option value="all">All Years</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    // Unique Indicators
    const indicators = [...new Set(data.map(item => item.indicator_name))].sort();
    const indicatorList = document.getElementById('indicator-list');
    indicatorList.innerHTML = ''; // Clear existing

    // reset active filter for indicators
    activeFilters.indicators = new Set();
    document.getElementById('indicator-summary').innerText = "All Indicators";

    indicators.forEach(ind => {
        const item = document.createElement('div');
        item.className = 'option-item';
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = ind;
        checkbox.onchange = () => handleIndicatorChange(ind, checkbox.checked);

        // Label
        const label = document.createElement('span');
        label.textContent = ind;

        // Click on row to toggle
        item.onclick = (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                handleIndicatorChange(ind, checkbox.checked);
            }
        };

        item.appendChild(checkbox);
        item.appendChild(label);
        indicatorList.appendChild(item);
    });
}

function handleIndicatorChange(indicator, isChecked) {
    if (isChecked) {
        activeFilters.indicators.add(indicator);
    } else {
        activeFilters.indicators.delete(indicator);
    }

    const count = activeFilters.indicators.size;
    const summary = document.getElementById('indicator-summary');
    if (count === 0) {
        summary.innerText = "All Indicators";
    } else if (count === 1) {
        // Show the name of the single selected indicator, truncated
        summary.innerText = [...activeFilters.indicators][0];
    } else {
        summary.innerText = `${count} Indicators Selected`;
    }

    applyFilters();
}

function toggleIndicatorDropdown() {
    const dropdown = document.getElementById('indicator-options');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const multiselect = document.getElementById('indicator-multiselect');
    const dropdown = document.getElementById('indicator-options');
    if (!multiselect.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

function filterIndicators() {
    const query = document.getElementById('indicator-search').value.toLowerCase();
    const items = document.querySelectorAll('.option-item');
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

function applyFilters() {
    // Get Year Filter
    const yearVal = document.getElementById('year-filter').value;
    activeFilters.year = yearVal;

    // Filter Data
    const filteredData = currentData.filter(row => {
        // Year Logic
        if (activeFilters.year !== 'all' && row.reporting_year.toString() !== activeFilters.year) {
            return false;
        }
        // Indicator Logic
        if (activeFilters.indicators.size > 0 && !activeFilters.indicators.has(row.indicator_name)) {
            return false;
        }
        return true;
    });

    renderTable(filteredData);
}

function renderTable(data) {
    const tbody = document.querySelector('#metrics-table tbody');
    tbody.innerHTML = '';

    // Update Summary based on Filtered Data
    const avgScore = data.length ? (data.reduce((acc, curr) => acc + curr.data_quality_score, 0) / data.length) : 0;

    document.getElementById('score-val').innerText = Math.round(avgScore);
    document.getElementById('indicators-val').innerText = data.length;
    // Keep company name from global data if filtered data is empty, or use first row
    const company = (data.length > 0) ? data[0].company_name : (currentData[0]?.company_name || 'N/A');
    document.getElementById('company-val').innerText = company;

    data.forEach(row => {
        const tr = document.createElement('tr');

        const scoreClass = row.data_quality_score >= 80 ? 'dq-high' :
            (row.data_quality_score >= 50 ? 'dq-med' : 'dq-low');

        // Removed Year Column from TD
        tr.innerHTML = `
            <td>${row.indicator_name}</td>
            <td style="font-family: monospace; color: var(--text-primary);">${row.indicator_value}</td>
            <td style="color: var(--text-secondary);">${row.value_unit || '-'}</td>
            <td><span class="dq-score ${scoreClass}">${row.data_quality_score}</span></td>
            <td style="text-transform: capitalize;">${row.data_source}</td>
        `;
        tbody.appendChild(tr);
    });
}

function exportData(format) {
    // Export filtered data instead of all data? usually filtered is expected in such UI
    // Let's use filtered data by re-running filter or storing it.
    // For simplicity, let's re-run logic or filter currentData.

    const yearVal = document.getElementById('year-filter').value;
    const filteredData = currentData.filter(row => {
        if (yearVal !== 'all' && row.reporting_year.toString() !== yearVal) return false;
        if (activeFilters.indicators.size > 0 && !activeFilters.indicators.has(row.indicator_name)) return false;
        return true;
    });

    if (!filteredData || filteredData.length === 0) return alert("No data to export");

    let content, mimeType, extension;

    if (format === 'json') {
        content = JSON.stringify(filteredData, null, 2);
        mimeType = 'application/json';
        extension = 'json';
    } else {
        // CSV
        const headers = Object.keys(filteredData[0]);
        content = [
            headers.join(','),
            ...filteredData.map(row => headers.map(fieldName =>
                JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
            ).join(','))
        ].join('\r\n');

        mimeType = 'text/csv';
        extension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brsr_export_${new Date().toISOString().slice(0, 10)}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
}

