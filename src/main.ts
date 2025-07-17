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
  newStep.innerHTML = `<input type="text" placeholder="Enter a step" class="w-full p-2 border rounded list-item ">`;
  stepList.appendChild(newStep);
}

const addStepBtn = document.querySelector('.add-step') as HTMLButtonElement;
if (addStepBtn) {
  addStepBtn.addEventListener('click', addStep);
}

const removeStep = (event: Event) => {
  event.preventDefault();
  const stepList = document.getElementById('step-list');
  if (!stepList) return;
  const stepItem = stepList.querySelector('li:last-child');

  if (stepItem) {
    stepList.removeChild(stepItem);
  }
};

const removeStepBtn = document.querySelector('.remove-step');

if (removeStepBtn) {
  removeStepBtn.addEventListener('click', removeStep);
}

const form = document.getElementById('postForm') as HTMLFormElement;
form?.addEventListener('submit',async (event: Event) => {
  event.preventDefault();

  const authorName = (document.getElementById("authorName")as HTMLInputElement).value;
  const title = (document.getElementById("title")as HTMLInputElement).value;
  const description = (document.getElementById("description")as HTMLInputElement).value;
  const imageFile = (document.getElementById("image")as HTMLInputElement ).files?.[0]
  const steps = Array.from(document.querySelectorAll<HTMLInputElement>('#step-list li input')).map(input => input.value);
  const imageBase64 = imageFile ? await toBase64(imageFile) : null;


const post ={
  authorName,
  title,
  description,
  steps,
  imageBase64,
  createdAt: new Date().toISOString(),
};

const existingPost = JSON.parse(localStorage.getItem('posts') || '[]');
existingPost.push(post);
localStorage.setItem('posts', JSON.stringify(existingPost));

alert('Post created successfully!');
form.reset();
document.getElementById("step-list")!.innerHTML = "";
console.log(post)
});


function toBase64(file:File):Promise<string>{
       return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = ()=> resolve(reader.result as string)
         reader.onerror = reject;
         reader.readAsDataURL(file);
       })
}

