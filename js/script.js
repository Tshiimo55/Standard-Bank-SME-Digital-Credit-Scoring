// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const form = document.getElementById('loanApplicationForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContent = document.getElementById('resultsContent');
    const emptyState = document.getElementById('emptyState');

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading, hide results and empty state
        loadingIndicator.style.display = 'block';
        resultsContent.style.display = 'none';
        emptyState.style.display = 'none';
        
        // Get form data
        const formData = {
            businessName: document.getElementById('businessName').value,
            revenue: parseFloat(document.getElementById('revenue').value),
            yearsInOperation: document.getElementById('yearsInOperation').value,
            industry: document.getElementById('industry').value,
            employees: parseInt(document.getElementById('employees').value),
            loanAmount: parseFloat(document.getElementById('loanAmount').value)
        };
        
        // Simulate API call (will be replaced with actual backend)
        setTimeout(() => {
            // Calculate mock credit assessment
            const assessment = calculateCreditAssessment(formData);
            
            // Update UI with results
            updateResults(assessment);
            
            // Hide loading, show results
            loadingIndicator.style.display = 'none';
            resultsContent.style.display = 'block';
        }, 2000); // Simulate 2 second processing time
    });

    // Mock credit assessment calculation (temporary - will be replaced by backend)
    function calculateCreditAssessment(data) {
        // This is mock logic - will be replaced by actual backend API
        let score = 0;
        let factors = [];
        
        // Revenue assessment
        if (data.revenue > 5000000) {
            score += 300;
            factors.push({ type: 'positive', text: 'Strong annual revenue' });
        } else if (data.revenue > 1000000) {
            score += 200;
            factors.push({ type: 'positive', text: 'Moderate revenue' });
        } else {
            score += 100;
            factors.push({ type: 'warning', text: 'Limited revenue' });
        }
        
        // Years in operation assessment
        if (data.yearsInOperation === '10+') {
            score += 250;
            factors.push({ type: 'positive', text: 'Long-established business' });
        } else if (data.yearsInOperation === '5-10') {
            score += 200;
            factors.push({ type: 'positive', text: 'Established business history' });
        } else if (data.yearsInOperation === '2-5') {
            score += 150;
            factors.push({ type: 'warning', text: 'Growing business' });
        } else {
            score += 100;
            factors.push({ type: 'negative', text: 'Limited operational history' });
        }
        
        // Industry risk assessment
        const lowRiskIndustries = ['technology', 'services', 'healthcare'];
        const mediumRiskIndustries = ['retail', 'manufacturing', 'agriculture'];
        
        if (lowRiskIndustries.includes(data.industry)) {
            score += 200;
            factors.push({ type: 'positive', text: 'Low-risk industry sector' });
        } else if (mediumRiskIndustries.includes(data.industry)) {
            score += 150;
            factors.push({ type: 'warning', text: 'Medium-risk industry sector' });
        } else {
            score += 100;
            factors.push({ type: 'warning', text: 'Higher-risk industry sector' });
        }
        
        // Employee count assessment
        if (data.employees > 50) {
            score += 150;
            factors.push({ type: 'positive', text: 'Strong workforce size' });
        } else if (data.employees > 10) {
            score += 100;
            factors.push({ type: 'positive', text: 'Adequate workforce' });
        } else {
            score += 50;
            factors.push({ type: 'warning', text: 'Small workforce' });
        }
        
        // Determine risk classification
        let riskLevel = 'High';
        let loanDecision = 'Declined';
        let maxAmount = 0;
        
        if (score >= 700) {
            riskLevel = 'Low';
            loanDecision = 'Approved';
            maxAmount = Math.min(data.loanAmount * 1.5, 2000000);
        } else if (score >= 500) {
            riskLevel = 'Medium';
            loanDecision = 'Conditional';
            maxAmount = Math.min(data.loanAmount, 1000000);
        } else {
            riskLevel = 'High';
            loanDecision = 'Declined';
            maxAmount = 0;
        }
        
        // Calculate debt ratio (mock)
        const debtRatio = ((data.loanAmount / data.revenue) * 100).toFixed(1);
        
        return {
            creditScore: Math.min(score, 1000),
            riskLevel: riskLevel,
            loanDecision: loanDecision,
            maxAmount: maxAmount,
            debtRatio: debtRatio + '%',
            stability: data.yearsInOperation === '10+' ? 'High' : (data.yearsInOperation === '5-10' ? 'Medium' : 'Low'),
            industryRisk: lowRiskIndustries.includes(data.industry) ? 'Low' : (mediumRiskIndustries.includes(data.industry) ? 'Medium' : 'High'),
            factors: factors.slice(0, 5) // Show top 5 factors
        };
    }

    // Update UI with assessment results
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
            li.textContent = factor.type === 'positive' ? '✓ ' + factor.text : 
                            (factor.type === 'warning' ? '⚠ ' + factor.text : '✗ ' + factor.text);
            factorsList.appendChild(li);
        });
    }
});