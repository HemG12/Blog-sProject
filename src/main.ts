import './style.css'

document.querySelectorAll('.open-btn').forEach((btn)=>{
btn.addEventListener('click', () => {
  const modalId = btn.getAttribute('data-modal');
  if (!modalId) return;
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
})
})

document.querySelectorAll('.close-btn').forEach((btn)=>{
  btn.addEventListener('click', () => {
    const modal = btn.closest('.fixed');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
});

function addStep(event: Event){
  event.preventDefault();
  const stepList = document.getElementById('step-list');
  if (!stepList) return;
  const newStep = document.createElement('li');
  newStep.innerHTML = `<input type="text" placeholder="Enter a step" class="w-full p-2 border rounded">`;
  stepList.appendChild(newStep);
}

const addStepBtn = document.querySelector('.add-step') as HTMLButtonElement;
if (addStepBtn) {
  addStepBtn.addEventListener('click', addStep);
}

const removeStep = (event: Event) => {
  const stepList = document.getElementById('step-list');
  if (!stepList) return;
  const stepItem = (event.target as HTMLElement).closest('li');
  if (stepItem) {
    stepList.removeChild(stepItem);
  }
};

const removeStepBtns = document.querySelectorAll('.remove-step');
removeStepBtns.forEach(btn => {
  btn.addEventListener('click', removeStep);
});