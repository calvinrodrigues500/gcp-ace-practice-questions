async function loadQuestions() {
  const content = document.getElementById('content');
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load data.json');
    const questions = await response.json();

    content.innerHTML = ''; // clear loading text

    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']; // extend if needed

    questions.forEach(q => {
      const article = document.createElement('article');
      article.className = 'question';
      article.id = q.id;  // keep id as is, e.g. 'q43'

      // Remove 'q' prefix for display number if present
      const displayNumber = q.id.startsWith('q') ? q.id.slice(1) : q.id;

      // Build options list with letter prefix dynamically
      const optionsHtml = q.options.map((opt, i) => {
        const label = optionLabels[i] || '?';
        return `<li>${label}) ${opt}</li>`;
      }).join('');

      // Get correct answer letter and option text
      const correctLabel = optionLabels[q.correct] || '?';
      const correctOptionText = q.options[q.correct] || '';

      // Generate unique IDs for explanation and toggle link
      const explanationId = `explanation-${q.id}`;
      const toggleId = `toggle-${q.id}`;

      article.innerHTML = `
        <h3>Question ${displayNumber}</h3>
        <p>${q.question}</p>
        <ul>${optionsHtml}</ul>
        <div>
          <a href="#" id="${toggleId}" aria-expanded="false" aria-controls="${explanationId}">Show Answer</a>
          <div id="${explanationId}" class="answer" style="display:none; margin-top: 0.5em;">
            <strong>Correct Answer: ${correctLabel}) ${correctOptionText}</strong><br />
            ${q.explanation}
          </div>
        </div>
      `;

      content.appendChild(article);

      // Add click event listener for toggle link
      const toggleLink = document.getElementById(toggleId);
      const explanationDiv = document.getElementById(explanationId);

      toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        const isVisible = explanationDiv.style.display === 'block';
        explanationDiv.style.display = isVisible ? 'none' : 'block';
        toggleLink.textContent = isVisible ? 'Show Answer' : 'Hide';
        toggleLink.setAttribute('aria-expanded', !isVisible);
      });
    });
  } catch (err) {
    content.textContent = `Error loading questions: ${err.message}`;
  }
}

// Load questions when DOM is ready
window.addEventListener('DOMContentLoaded', loadQuestions);
