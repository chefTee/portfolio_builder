document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('template4form');
    const imageInput = document.getElementById('profileImageInput')
     const portfolioPreview = document.getElementById('portfolioPreview');
    const downloadButton = document.getElementById('downloadButton');
     if (window.innerWidth >= 700){
            downloadButton.style.display = 'block';
    }else{
            alert('PDF generation is only allowed on desktop for the best experience.');
            downloadButton.style.display = 'none';
            history.back();
    }

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
//Portfolio Preview Generation
    function generatePortfolioPreview(data, imageFile) {
        form.classList.add("hide");
        downloadButton.classList.remove('hide');
        //Clearing the previous preview and ensuring a clean state for the next preview
        portfolioPreview.innerHTML = '';

        //Creating the header section
        const header = document.createElement('section');
        header.className = 'header';
        header.innerHTML = `
        <div class="intro">
            <p class"greetings">Hello!</p>
            <p class="name">I'm <span>${data.firstname} ${data.lastname}</span></p>
            <p class="role">${data.role}</p>
            <p class="role-summary">${data.aboutYourRole}</p>
            <p class="work-status">Available to work</p>
        </div>
        <div class="profile-image-section">
            <img src=""class="image" alt="Profile Image">
         </div>
        `;
        portfolioPreview.appendChild(header);


        //Creating the experience section
        const exp = document.createElement('section');
        exp.className = 'experience';
        exp.innerHTML = `
                <h2>Experience</h2>
                <div class="exp-section">
                        <div class="third exp1">
                            <div class="date">${data.jobFirstStartDate}-${data.jobFirstEndDate}</div>
                            <div class="exp-role">
                                <p class="title">${data.jobFirstRole}</p>
                                <p class="exp-role-summary">${data.roleFirstSummary}</p>
                            </div>
                        </div>
                        <div class="second exp2">
                            <div class="date">${data.jobSecondStartDate}-${data.jobSecondEndDate}</div>
                            <div class="exp-role">
                                <p class="title">${data.jobSecondRole}</p>
                                <p class="exp-role-summary">${data.roleSecondSummary}</p>
                            </div>
                        </div>
                        <div class="recent exp3">
                            <div class="date">${data.jobThreeStartDate}-${data.jobThreeEndDate}</div>
                            <div class="exp-role">
                                <p class="title">${data.jobThreeRole}</p>
                                <p class="exp-role-summary">${data.roleThreeSummary}</</p>
                            </div>
                        </div>
                </div>
        `;
        portfolioPreview.appendChild(exp);


        //creating the skillset question
        const skillset = document.createElement('section');
        skillset.className = 'skillset';
        skillset.innerHTML = `
            <h2>MY SKILLSET</h2>
            <div class="skilslist">
                <h3>Skills/Tools</h3>
                <ul>
                    <li>${data.skillOne}</li>
                    <li>${data.skillTwo}</li>
                    <li>${data.skillThree}</li>
                    <li>${data.skillFour}</li>
                </ul>
            </div>
        `;
        portfolioPreview.appendChild(skillset);


        //creating the contact section
        const contact = document.createElement('section');
        contact.className = 'contact';
        contact.innerHTML = `
            <h2>Contact Me!</h2>
            <p class="mail"><img src="./images/Email.svg" alt="">${data.email}</p>
            <p class="phone-number"><img src="./images/Phone.svg" alt="">${data.phone}</p>
        `;
        portfolioPreview.appendChild(contact);


        //Uploading the image
        if(imageFile && imageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = header.querySelector('.image');
                img.src = e.target.result;
                img.alt = data.name ? `${data.name}'s Profile Image` : 'Profiles Image';
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

            doc.save(`${data.firstname} ${data.lastname}.pdf`);

        } catch (error) {
            console.error('Error generating porfolio PDF:', error);
            alert('Failed to generate PDF. Please try again.');
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