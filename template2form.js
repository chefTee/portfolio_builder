document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('template2form');
    const imageInput = document.getElementById('profileImageInput')
    const portfolioPreview = document.getElementById('portfolioPreview');
    const downloadButton = document.getElementById('downloadButton')
    if (window.innerWidth >= 700){
            downloadButton.style.display = 'block';
    }else{
            alert('PDF generation is only allowed on desktop for the best experience.');
            downloadButton.style.display = 'none';
            location.reload();
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
        header.className = 'temptwo-intro-section';
        header.innerHTML = `
            <div class="intro-content">
                <h1><span>HELLO, I'M </span><br>${data.firstname} <br>${data.lastname}</h1>
                <p>A ${data.role}</p>
                <button>Status: Available</button>
            </div>
            <div class="profile-content">
                <img src=""class="image" alt="Profile Image">
            </div>
        `;
        portfolioPreview.appendChild(header);

        //Creating the about section
        const about = document.createElement('section');
        about.className = 'temptwo-details-section';
        about.innerHTML = `
            <div class="details-profile-content">
                <img src="" class="image" alt="Profile Image">
            </div>
            <div class="details-content">
                <h3>ABOUT ME</h3>
                <p>${data.aboutYou}</p>
                <p>${data.aboutExperiences}</p>
                <div class="information">
                    <ul>
                        <li>Name: ${data.firstname} ${data.lastname}</li>
                        <li>Age: ${data.age}</li>
                        <li>Occupation: ${data.role}</li>
                        <li>Education: ${data.education}</li>
                    </ul>
                    <ul>
                        <li>Phone: ${data.phone}</li>
                        <li>Email: ${data.email}</li>
                        <li>Country: ${data.country}</li>   
                        <li>Status: Availabe for work</li>
                    </ul>
                </div>
            </div>


        `;
        portfolioPreview.appendChild(about);

        //Creating the stats section
        const stats = document.createElement('section');
        stats.className = 'temptwo-stats-section';
        stats.innerHTML = `
            <div>
                <p class="num">${data.expnum}</p>
                <p class="spec">+YEARS OF EXPERIENCE</p>
            </div>
            <div>
                <p class="num">${data.clientnum}</p>
                <p class="spec">+CLIENTS</p>
            </div>
            <div>
                <p class="num">${data.projnum}</p>
                <p class="spec">+TOTAL PROJECTS</p>
            </div>
        `;
        portfolioPreview.appendChild(stats);


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
        const doc = new jsPDF('p', 'pt', 'a5');
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
                scale: window.devicePixelRatio || 2,
                logging: false //for a clean console
            });

            //Coverting image to pdf
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const imageWidth = 580;
                    const imageHeight = 655;
                    const x = (pageWidth - imageWidth) / 2;
            doc.addImage(

                canvas.toDataURL('image/png'),//converting image to 64bit
                'PNG', //setting image type
                x,
                5,
                imageWidth,
                imageHeight
            );

            doc.save(`${data.firstname} ${data.lastname}.pdf`);

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