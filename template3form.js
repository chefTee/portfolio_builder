document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('template3form');
    const imageInput = document.getElementById('profileImageInput')
    const portfolioPreview = document.getElementById('portfolioPreview');
    const downloadButton = document.getElementById('downloadButton')
    //Getting the preview of the image
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file){
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewImage = document.querySelector('#portfolioPreview.image');
                if (previewImage) {
                    previewImage.src = event.target.result;
                }
            };

            reader.readAsDataURL(file);
        }
    })


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

    function generatePortfolioPreview(data, imageFile) {
        form.classList.add("hide");
        downloadButton.classList.remove('hide');
        //Clearing the previous preview and ensuring a clean state for the next preview
        portfolioPreview.innerHTML = '';

        //Creating the header section
        const header = document.createElement('section');
        header.className = 'header';
        header.innerHTML = `
            <div class="profile-image-section">
            <img src=""class="image" alt="Profile Image">
            </div>
            <p class="name">${data.firstname} ${data.lastname}</p>
            <p class="role">${data.role}</p>
            <p class="status">Available for work</p>
        `;
        portfolioPreview.appendChild(header);

        //Creating the about section
        const about = document.createElement('section');
        about.className = 'about';
        about.innerHTML = `
            <h2>${data.role}</h2>
            <p class="summary-one">
            ${data.aboutYourRole}
            </p>
            <p class="summary-two">
            ${data.aboutExperiences}
            </p>
        `;
        portfolioPreview.appendChild(about);

        //Creating the experience section
        const exp = document.createElement('section');
        exp.className = 'experience';
        exp.innerHTML = `
                <div class="exp-content"> 
                        <div class="third exp">
                            <div class="date">${data.jobFirstStartDate}-${data.jobFirstEndDate}</div>
                            <div class="exp-summary">
                                <p class="role">${data.jobFirstRole}</p>
                                <p class="role-summary">${data.roleFirstSummary}</p>
                            </div>
                        </div>

                        <div class="second exp">
                            <div class="date">${data.jobTwoStartDate}-${data.jobTwoEndDate}</div>
                            <div class="exp-summary">
                                <p class="role">${data.jobTwoRole}</p>
                                <p class="role-summary">${data.roleTwoSummary}</p>
                            </div>
                        </div>

                        <div class="recent exp">
                            <div class="date">${data.jobThreeStartDate}-${data.jobThreeEndDate}</div>
                            <div class="exp-summary">
                                <p class="role">${data.jobThreeRole}</p>
                                <p class="role-summary">${data.roleThreeSummary}</p>
                            </div>
                        </div>
                    <div class="exp-bg"></div>
                </div>
                
        `;
        portfolioPreview.appendChild(exp);

        //creating the contact contact section
        const contact = document.createElement('section');
        contact.className = 'contact';
        contact.innerHTML = `
            <p>Looking to upscale your business? let’s work together</p>
            <p>To see more of my work, visit my socials</p>
            <div class="contact-details">
                <div class="mail"><img src="./images/Gmail.svg" alt="">${data.email}</div>
                <div class="phone-number"><img src="./images/Ringing Phone.svg" alt="">${data.phone}</div>
            </div>
        `;
        portfolioPreview.appendChild(contact);


        //Uploading the image
        if(imageFile && imageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const headerImg = header.querySelector('.image');
                const aboutImg = about.querySelector('.image');

                if(headerImg){
                    headerImg.src = e.target.result;
                    headerImg.alt =  data.name ? `${data.name}'s Profile Image` : 'Profiles Image';
                }

                if(aboutImg){
                    aboutImg.src = e.target.result;
                    aboutImg.alt =  data.name ? `${data.name}'s Profile Image` : 'Profiles Image';
                }
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

            const canvas = await html2canvas(portfolio, {
                allowTaint: true,
                useCORS: true,
                scale: 4,
                logging: false //for a clean console
            });

            //Coverting image to pdf
            doc.addImage(
                canvas.toDataURL('image/png'),//converting image to 64bit
                'PNG', //setting image type
                5,
                5,
                590,
                650
            );

            doc.save(`${data.name}.pdf`);

        } catch (error) {
            console.error('Error generating porfolio PDF:', error);
            alert('Failed to generate PDF. Please try again.')
        }


    }


    downloadButton.addEventListener('click', () => {
        // Collecting form data again when the download button is clicked
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Trigger the PDF generation function
        generatePDF(data);
    });

})