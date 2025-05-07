const themeToggle = document.querySelector('.theme-toggle');
const promptForm = document.querySelector('.prompt-form');
const promptBtn = document.querySelector('.prompt-btn');
const generateBtn = document.querySelector('.generate-btn');
const promptInput = document.querySelector('.prompt-input');
const modelSelect = document.getElementById('model-select');
const countSelect = document.getElementById('count-select');
const ratioSelect = document.getElementById('ratio-select');
const gridGallery = document.querySelector('.gallery-grid');

const API_KEY = 'your_huggingface_API here'; //huggingface API key

const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];
// set theme based on saved preference or system default
(() => {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('prefers-color-scheme: dark').matches;

  const isDarkTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle('dark-theme');
  themeToggle.querySelector('i').className = isDarkTheme ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
})();

//switch between dark and light color
const toggleTheme = () =>{
  const isDarkTheme = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  themeToggle.querySelector('i').className = isDarkTheme ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
};
//here classlist.toogle adds and removes the dark-theme if present and adds if absent in body tag

const getImageDimensions = (aspectRatio , baseSize = 512) => {
  //calculatewidth/height based on the chosen ratio
  const [width, height] = aspectRatio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);

  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);

  // Ensure dimensions are multiples of 16 (required by AI models)
  calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
  calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

  return { width: calculatedWidth, height: calculatedHeight };
}

//replace loading spinner with the actual image
const updateImageCard = (imgIndex , imgUrl) => {
  const imgCard = document.getElementById(`img-card-${imgIndex}`);
  if(!imgCard) return;

  imgCard.classList.remove('loading');
  imgCard.innerHTML = `<img src="${imgUrl}" class="result-img">
            <div class="img-overlay">
              <a href="${imgUrl}" class="img-download-btn" download = '${Date.now()}.png'>
                <i class="fa-solid fa-download"></i>
              </button>
            </div>`;
}
//send request to hugging face api to craete image
const generateImage = async(selectModel , imageCount, aspectRatio, promptBtn, promptText) =>{
  const MODEL_URL = (`https://api-inference.huggingface.co/models/${selectModel}`);
 const {width ,height} = getImageDimensions(aspectRatio);
 generateBtn.setAttribute('disabled', 'true');

 console.log(selectModel);
 //create an array of image generation promises
const imagePromises = Array.from({length:imageCount},async(_,i) =>{

//send request to the AI model APi
  try {
    const response = await fetch(MODEL_URL ,{
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "x-use-cache":"false",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: promptText,
        parameters:{width,height},
        options:{wait_for_model: true, user_cache:false},
      }
      ),
    });

    if(!response.ok) throw new Error((await response.json())?.error);

    //convert responce to an image url and update the image card
    const result = await response.blob();
    console.log(result);
    updateImageCard(i, URL.createObjectURL(result));
    } catch (error) {
    console.log(error) 
    const imgCard = document.getElementById(`img-card-${i}`);
    imgCard.classList.replace('loading' , 'error');
    imgCard.querySelector('.status-text').textContent = 'Generation failed! check console for more details.';
    }
})

await Promise.allSettled(imagePromises);
generateBtn.removeAttribute('disabled');
};

const createImageCards = (selectModel , imageCount, aspectRatio, promptBtn , promptText)=> {

  gridGallery.innerHTML = '';
  for (let i = 0; i < imageCount; i++) {
   gridGallery.innerHTML += `
          <div class="img-card loading" id='img-card-${i}' style='aspect-ratio:${aspectRatio}'>
            <div class="status-container">
              <div class="spinner"></div>
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div class="status-text">Generating...</div>
            </div>
          </div>
   `;
  }
  generateImage(selectModel, imageCount, aspectRatio, promptBtn, promptText);
};

// List of models that are known to not work properly
const unavailableModels = [
  'stabilityai/stable-diffusion-2',
  'CompVis/stable-diffusion-v1-4-original',
  'black-forest-labs/FLUX.1-dev'
];
//handle form submission
const handleFormSubmit =(e) => {
  e.preventDefault();

  //get form values
  const selectModel = modelSelect.value;
  const imageCount = parseInt(countSelect.value) || 1;
  const aspectRatio = ratioSelect.value 
  || '1/1';
  const promptText = promptInput.value.trim();

  
// Alert user if selected model is unsupported
  if (unavailableModels.includes(selectModel)) {
    showModelUnavailableAlert({
      modelName: selectModel,
      onDismiss: () => console.log("User dismissed alert"),
      onViewModels: () => {
        modelSelect.focus();
        modelSelect.style.border = '2px solid red';
      }
    });
    return;
  }

//  // Alert user if selected model is unsupported
//  if (unsupportedModels.includes(selectModel)) {
//   alert(`⚠️ The model "${selectModel}" is currently not working.\nPlease choose another one like "FLUX-1-schnell" or "Stable Diffusion XL".`);
//   return; // Stop the form from submitting
// }

  createImageCards(selectModel , imageCount, aspectRatio, promptBtn ,promptText );
}

//fill prompt input with random example
promptBtn.addEventListener('click', () => {
  const prompt = examplePrompts[Math.floor(Math.random()*examplePrompts.length)];
  promptInput.value =prompt;
  promptInput.focus();
})

promptForm.addEventListener('submit', handleFormSubmit);

themeToggle.addEventListener('click', toggleTheme);

//alert function for customized alert if model unavailable
function showModelUnavailableAlert(options = {}) {
  const {
    modelName = "Selected model",
    onDismiss = () => {},
    onViewModels = () => {},
    autoDismissTime = 8000
  } = options;

  const alertContainer = document.createElement('div');
  alertContainer.id = 'model-unavailable-alert';
  alertContainer.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    max-width: 400px;
    z-index: 9999;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
  `;

  alertContainer.innerHTML = `
    <div style="
      background-color: #FEF2F2;
      border-left: 4px solid #EF4444;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    ">
      <div style="display: flex; align-items: flex-start;">
        <div style="flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div style="margin-left: 12px; flex: 1;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 500; color: #991B1B;">Model Unavailable</h3>
          <div style="margin-top: 8px;">
            <p style="margin: 0; font-size: 14px; color: #B91C1C;">
              The model is ${modelName} currently not working.Please choose another one like "FLUX-1-schnell" or "Stable Diffusion XL.
            </p>
          </div>
          <div style="margin-top: 16px; display: flex; gap: 12px;">
            <button id="alert-dismiss-btn" style="
              padding: 8px 16px;
              background-color: white;
              color: #B91C1C;
              font-size: 14px;
              font-weight: 500;
              border-radius: 6px;
              border: 1px solid #FCA5A5;
              cursor: pointer;
              transition: background-color 0.2s;
            ">
              Dismiss
            </button>
            <button id="alert-view-models-btn" style="
              padding: 8px 16px;
              background-color: #DC2626;
              color: white;
              font-size: 14px;
              font-weight: 500;
              border-radius: 6px;
              border: none;
              cursor: pointer;
              transition: background-color 0.2s;
            ">
              View Available Models
            </button>
          </div>
        </div>
        <button id="alert-close-btn" style="
          background: none;
          border: none;
          cursor: pointer;
          color: #EF4444;
          margin-left: 16px;
          padding: 0;
        ">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(alertContainer);
  setTimeout(() => {
    alertContainer.style.opacity = '1';
    alertContainer.style.transform = 'translateY(0)';
  }, 10);

  const dismissAlert = () => {
    alertContainer.style.opacity = '0';
    alertContainer.style.transform = 'translateY(20px)';
    setTimeout(() => {
      if (alertContainer.parentNode) {
        alertContainer.parentNode.removeChild(alertContainer);
      }
      onDismiss();
    }, 300);
  };

  alertContainer.querySelector('#alert-dismiss-btn').addEventListener('click', dismissAlert);
  alertContainer.querySelector('#alert-close-btn').addEventListener('click', dismissAlert);
  alertContainer.querySelector('#alert-view-models-btn').addEventListener('click', () => {
    onViewModels();
    dismissAlert();
  });

  if (autoDismissTime > 0) {
    setTimeout(dismissAlert, autoDismissTime);
  }

  return { dismiss: dismissAlert };
}
