import './style.css';

document.querySelectorAll('.open-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    console.log(modalId)
    if (!modalId) return;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  });
});

document.querySelectorAll('.close-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.fixed');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
});

function addStep(event: Event) {
  event.preventDefault();
  const stepList = document.getElementById('step-list');
  if (!stepList) return;
  const newStep = document.createElement('li');
  newStep.innerHTML = `<input type="text" placeholder="Enter a step" class="w-full p-2 border rounded list-item">`;
  stepList.appendChild(newStep);
}

const addStepBtn = document.querySelector('.add-step') as HTMLButtonElement;
addStepBtn?.addEventListener('click', addStep);

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
removeStepBtn?.addEventListener('click', removeStep);

const form = document.getElementById('postForm') as HTMLFormElement;
form?.addEventListener('submit', async (event: Event) => {
  event.preventDefault();

  const authorName = (document.getElementById("authorName") as HTMLInputElement).value;
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const description = (document.getElementById("description") as HTMLInputElement).value;
  const imageFile = (document.getElementById("image") as HTMLInputElement).files?.[0];
  const steps = Array.from(document.querySelectorAll<HTMLInputElement>('#step-list li input')).map(input => input.value);
  const imageBase64 = imageFile ? await toBase64(imageFile) : null;

  const post = {
    authorName,
    title,
    description,
    steps,
    imageBase64,
    createdAt: new Date().toISOString(),
  };

  const existingPost = JSON.parse(localStorage.getItem('posts') || '[]');
  existingPost.unshift(post); // add to top
  localStorage.setItem('posts', JSON.stringify(existingPost));

  alert('Post created successfully!');
  form.reset();
  document.getElementById("step-list")!.innerHTML = "";
  displayPost();
});

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function displayPost(search?: string) {
  const storedPosts = localStorage.getItem('posts');
  if (!storedPosts) return;

  const postData = JSON.parse(storedPosts);
  const display = document.getElementById("postCard");
  if (!display) return;

  display.innerHTML = ""; // clear previous

postData.forEach((post: any, index: number) => {
    const postElement = document.createElement('div');
    postElement.className = 'post-card w-full mx-auto gap-4 mt-10 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100';

    postElement.innerHTML = `
      <div class="flex items-center justify-between">
        <p class="mt-1 text-[#5D4037] font-medium">Author: ${post.authorName}</p>
        <p class="mt-1 text-[#5D4037]/80 text-sm">Posted on: ${new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
      ${post.imageBase64 ? `
        <img 
          src="${post.imageBase64}" 
          alt="Post Image" 
          class="mx-auto mt-6 h-48 w-full object-cover rounded-lg border border-[#F9F7F0]"
        >
      ` : ''}
      <h2 class="mt-2 text-xl font-bold text-[#5D4037]">${post.title}</h2>
      <p class="mt-1 text-[#5D4037]/90">${post.description}</p>
      <button 
        class="read-more px-4 py-2 bg-[#FFA07A] hover:bg-[#5D4037] text-white rounded mt-4 transition-colors w-full" 
        data-index="${index}"
      >
        Read More
      </button>
    `;

    display.appendChild(postElement);
});

  document.querySelectorAll('.read-more').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = (e.currentTarget as HTMLButtonElement).getAttribute('data-index');
      if (index) openModal(parseInt(index));
    });
  });
}

function openModal(index: number) {
  const storedPosts = localStorage.getItem('posts');
  if (!storedPosts) return;
  const postData = JSON.parse(storedPosts);

  const post = postData[index];
  if (!post) return;

  const modal = document.getElementById('postModel');
  if (!modal) return;

  (document.getElementById('title') as HTMLElement).textContent = post.title;
  (document.getElementById('img') as HTMLImageElement).src = post.imageBase64 || '';
  (document.getElementById('desc') as HTMLElement).textContent = post.description;
  (document.getElementById('span') as HTMLElement).textContent = `Posted on: ${new Date(post.createdAt).toLocaleDateString()} by ${post.authorName}`;
  
  const stepsList = document.getElementById('ol') as HTMLOListElement;
  stepsList.innerHTML = "";
  post.steps.forEach((step: string) => {
    const li = document.createElement('li');
    li.textContent = step;
    stepsList.appendChild(li);
  });

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function searchpost() {
  const searchInput = (document.getElementById('searchInput') as HTMLInputElement).value;
  const storedPosts = localStorage.getItem('posts');
  if (!storedPosts) return;

  const postData = JSON.parse(storedPosts);
  const filteredPosts = postData.filter((post: any) =>
    post.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const display = document.getElementById("postCard");
  if (!display) return;

  display.innerHTML = ""; // clear
  filteredPosts.forEach((post: any, index: number) => {
    const postElement = document.createElement('div');
 postElement.className = 'post-card w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100';

postElement.innerHTML = `
  <div class="flex items-center justify-between mb-3">
    <p class="text-sm text-[#81C784] font-medium">Author: ${post.authorName}</p>
    <p class="text-xs text-[#5D4037]/80">Posted on: ${new Date(post.createdAt).toLocaleDateString()}</p>
  </div>
  ${post.imageBase64 ? `
    <img 
      src="${post.imageBase64}" 
      alt="Post Image" 
      class="mx-auto mt-3 mb-4 h-48 w-full object-cover rounded-lg border border-[#F9F7F0]"
    >
  ` : ''}
  <h2 class="text-xl font-bold text-[#5D4037] mb-2">${post.title}</h2>
  <p class="text-[#5D4037]/90 mb-4">${post.description}</p>
  <button 
    class="read-more w-full px-4 py-2.5 bg-[#FFA07A] hover:bg-[#5D4037] text-white rounded-lg font-medium transition-colors" 
    data-index="${index}"
  >
    Read More
  </button>
`;


    display.appendChild(postElement);
  });

  document.querySelectorAll('.read-more').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = (e.currentTarget as HTMLButtonElement).getAttribute('data-index');
      if (index) openModal(parseInt(index));
    });
  });
}

function changeView() {
    const list = document.getElementById("postCard");
    if (list) {
        if (list.classList.contains('list')) {
            
            list.classList.remove('list');
            list.classList.remove('flex');
            list.classList.add('grid');
        } else {
            
            list.classList.add('list');
            list.classList.remove('grid');
            list.classList.add('flex');
        }
    }
}


document.getElementById('searchInput')?.addEventListener('input', searchpost);

document.getElementById("viewButton")?.addEventListener('click',changeView)

document.getElementById("create-post")?.addEventListener('click',()=>{
  const modal = document.getElementById("create-modal")
  modal?.classList.remove("hidden");
})


displayPost();
