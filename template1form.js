//Initial setup and event listeners
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('template1form');
    const imageInput = document.getElementById('profileImageInput')
    const portfolioPreview = document.getElementById('portfolioPreview');
    const downloadButton = document.getElementById('downloadButton');
    const generatePortfolioButton = document.getElementById('generatePortfolio');

    //Getting the preview of the image
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file){
            const reader = new FileReader(); //the use of filreader to convert the image to a base64 URL
            reader.onload = (event) => {
                const previewImage = document.querySelector('#portfolioPreview.image');
                if (previewImage) {
                    previewImage.src = event.target.result;
                }
            };

            reader.readAsDataURL(file);
        }
    })

//Form Submission Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        portfolioPreview.classList.remove('hide');
    //Collecting data from the form
        const formData = new FormData(form);
        const imageFile = formData.get('profileImage');
        const data = Object.fromEntries(formData.entries());

        //Generate the portfolio preview
        generatePortfolioPreview(data, imageFile);


    });

    //Portfolio preview generation
    function generatePortfolioPreview(data, imageFile) {
        form.classList.add("hide");
        downloadButton.classList.remove('hide');
        //Clearing the previous preview and ensuring a clean state for the next preview
        portfolioPreview.innerHTML = '';

        //Creating the header section
        const header = document.createElement('header');
        header.className = 'header';
        header.innerHTML = `
        <img src=""class="image" alt="Profile Image">
        <div class="intro">
            <p class="name">${data.name}</p>
            <p class="role">Hello world, I am a <span>${data.role}</span></p>
            <p class="summary">${data.aboutRole}</p>
        </div>
        `;
        portfolioPreview.appendChild(header);

        //Creating the about section
        const about = document.createElement('section');
        about.className = 'about';
        about.innerHTML = `
        <h2>ABOUT ME</h2>
        <p class="about-summary">${data.aboutYou}</p>
        `;
        portfolioPreview.appendChild(about);

        //Creating the skills section
        const skills = document.createElement('section');
        skills.className = 'skill-section';
        skills.innerHTML = `
        <h2>SKILLS</h2>
        <ul>
        <li>${data.skill1}</li>
        <li>${data.skill2}</li>
        <li>${data.skill3}</li>
        <li>${data.skill4}</li>
        <li>${data.skill5}</li>
        </ul>
        `;
        portfolioPreview.appendChild(skills);
        //Creating the experience section
        const exp = document.createElement('div');
        exp.className = "expsection";
        exp.innerHTML = `
        <h2>EXPERIENCES</h2>
        <p>${data.aboutExperiences}</p>
        `;
        portfolioPreview.appendChild(exp);

        //Creating the contact section
        const contact = document.createElement('div');
        contact.className = "contact";
        contact. innerHTML = `
            <h3>LET'S TALK</h3>
            <div class="details">
            <div>
            <p class="contactTitle">Phone:</p>
            <p>${data.phone}</p>
            </div>

            <div>
            <p class="contactTitle">Email:</p>
            <p>${data.email}</p>
            </div>
            </div>

        `;

        portfolioPreview.appendChild(contact);


        //Uploading the image
        if(imageFile && imageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = header.querySelector('.image');
                img.src = e.target.result;
                img.alt =  data.name ? `${data.name}'s Profile Image` : 'Profiles Image';
            };
            reader.readAsDataURL(imageFile);
        }

    }

    //coverting the html to pdf
    async function generatePDF(data){
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        //while the document is downloading
        const portfolio = document.getElementById('portfolioPreview');

        try{
            //Waiting for the profile image to load
            await new Promise((resolve, reject) => {
                const image = document.querySelector('.image')
                if (image.complete) {
                    resolve();
                } else{
                    image.onload = resolve;
                    image.onerror = reject;
                }
            });
            //converts html to canvas
            const canvas = await html2canvas(portfolio, {
                allowTaint: true,
                useCORS: true,
                scale: 4,
                logging: false //for a clean console
            });

            //adds canvas to PDF and save
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.addImage(
                canvas.toDataURL('image/png'),//converting image to 64bit
                'PNG', //setting image type
                5,
                5,
                pageWidth - 10,
                pageHeight - 10
            );

            doc.save(`${data.name}.pdf`);

        } catch (error) {
            console.error('Error generating porfolio PDF:', error);
            alert('Failed to generate PDF. Please try again.')
        }


    }
    generatePortfolioButton.addEventListener('click', () => {
        if (window.innerWidth >= 700){
            generatePortfolioButton.style.display = 'block';
            }else{
            alert('PDF generation is only allowed on desktop for the best experience.');
            history.back();
            }
    })


//download button handler
    downloadButton.addEventListener('click', () => {
        // Collecting form data again when the download button is clicked
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Trigger the PDF generation function
        generatePDF(data);
    });

})