document.getElementById('template1form').addEventListener('submit', (e) => {
    e.preventDefault();

    //GETTING DATA FROM FORM
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const about = document.getElementById('about').value;
    const skills = document.getElementById('skills').value;
    const tools = document.getElementById('tools').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    generatePdf(name, role, about, skills, tools, email, phone)

})



function generatePdf(name, role, about, skills, tools, email, phone) {
    console.log('Generating pdf for:', name);

    var { jsPDF } = jspdf;
    var doc = new jsPDF();


    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.text(name, 20, 10);

    doc.text(`Name: ${name}`, 20, 30);
    doc.text(`Role: ${role}`, 20, 50);
    doc.text(`About: ${about}`, 20, 70);
    doc.text(`Skills: ${skills}`, 20, 90);
    doc.text(`Tools: ${tools}`, 20, 110);
    doc.text(`Email: ${email}`, 20, 130);
    doc.text(`Phone: ${phone}`, 20, 150);

    doc.save(`${name}-portfolio.pdf`)
}
