// Replace the mock API call in your frontend
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanApplicationForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContent = document.getElementById('resultsContent');
    const emptyState = document.getElementById('emptyState');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        loadingIndicator.style.display = 'block';
        resultsContent.style.display = 'none';
        emptyState.style.display = 'none';
        
        const formData = {
            businessName: document.getElementById('businessName').value,
            revenue: parseFloat(document.getElementById('revenue').value),
            yearsInOperation: document.getElementById('yearsInOperation').value,
            industry: document.getElementById('industry').value,
            employees: parseInt(document.getElementById('employees').value),
            loanAmount: parseFloat(document.getElementById('loanAmount').value)
        };
        
        try {
            // Call real backend API
            const response = await fetch('http://localhost:8080/api/credit-scoring/assess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('API call failed');
            }
            
            const assessment = await response.json();
            updateResults(assessment);
            
            // Optionally save the application
            await fetch('http://localhost:8080/api/credit-scoring/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
        } catch (error) {
            console.error('Error:', error);
            // Show error message to user
            alert('Failed to get credit assessment. Please try again.');
        } finally {
            loadingIndicator.style.display = 'none';
            resultsContent.style.display = 'block';
        }
    });

    function updateResults(assessment) {
        document.getElementById('creditScore').textContent = assessment.creditScore;
        
        const riskBadge = document.getElementById('riskBadge');
        riskBadge.textContent = assessment.riskLevel + ' Risk';
        riskBadge.className = 'risk-badge ' + assessment.riskLevel.toLowerCase();
        
        document.getElementById('loanDecision').textContent = assessment.loanDecision;
        
        const maxAmountElement = document.getElementById('maxAmount');
        if (assessment.maxAmount > 0) {
            maxAmountElement.textContent = 'Maximum: R ' + assessment.maxAmount.toLocaleString();
        } else {
            maxAmountElement.textContent = 'No funding available';
        }
        
        document.getElementById('debtRatio').textContent = assessment.debtRatio;
        document.getElementById('stability').textContent = assessment.stability;
        document.getElementById('industryRisk').textContent = assessment.industryRisk;
        
        // Update factors list
        const factorsList = document.getElementById('factorsList');
        factorsList.innerHTML = '';
        assessment.factors.forEach(factor => {
            const li = document.createElement('li');
            li.className = factor.type + '-factor';
            
            let prefix = '';
            if (factor.type === 'positive') prefix = '✓ ';
            else if (factor.type === 'warning') prefix = '⚠ ';
            else prefix = '✗ ';
            
            li.textContent = prefix + factor.description;
            factorsList.appendChild(li);
        });
    }
});