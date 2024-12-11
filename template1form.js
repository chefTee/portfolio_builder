document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('template1form');
    const imageInput = document.getElementById('profileImageInput')
    const portfolioPreview = document.getElementById('portfolioPreview');

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


    //Collecting data from the form
        const formData = new FormData(form);
        const imageFile = formData.get('profileImage');
        const data = Object.fromEntries(formData.entries());

        //Generate the portfolio preview
        generatePortfolioPreview(data, imageFile);
    });

    function generatePortfolioPreview(data, imageFile) {
        //why is this line not working or how do  i set the genrated portfolio to load or open on a new page
        form.classList.add("hide");
        //Clearing the previous preview and ensuring a clean state for the next preview
        portfolioPreview.innerHTML = '';

        //Creating the header section
        const header = document.createElement('header');
        header.className = 'header';
        header.innerHTML = `
        <img src=""class="image" alt="Profile Image">
        <div class="intro">
            <p class="name">${data.name}</p>
            <p class="role">Hello world, I am a <strong>${data.role}</strong></p>
            <p class="summary">${data.aboutRole}</p>
        </div>
        `;
        portfolioPreview.appendChild(header);

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

    //function generatePDFWithjsPDF(formData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // Add content to PDF
        Object.entries(formData).forEach(([key, value], index) => {
            doc.text(`${key}: ${value}`, 20, 10 + (index * 10));
        });
    
        doc.save('form-details.pdf');
    

    // function printPDF() {
    //     window.print();
    // }

    // const printButton = document.createElement('button');
    // printButton.textContent = 'Print/Save PDF';
    // printButton.addEventListener('click', printPDF);
    // document.body.appendChild(printButton);

})