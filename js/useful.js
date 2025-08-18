// tabs and pills 
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.nav-item .label');
    const contents = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            // Remove active class from all tabs
            tabs.forEach(tab => tab.parentElement.classList.remove('active'));
            // Remove active class from all content panes
            contents.forEach(content => content.classList.remove('show', 'active'));

            // Add active class to the clicked tab
            tab.parentElement.classList.add('active');
            // Add active class to the corresponding content pane
            const target = document.querySelector(tab.getAttribute('href'));
            target.classList.add('show', 'active');
        });
    });
});
 window.addEventListener("scroll", function() {
            const header = document.getElementById("mainHeader2");
            if (window.scrollY > 100) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        });
// spilt screen 

// $(document).ready(function () {
//     function handleButtonClick(buttonId, inputId, screenOut, screenIn) {
//         $(buttonId).click(function () {
//             if ($(inputId)[0].checkValidity()) {
//                 $(screenOut).addClass('d-none');
//                 $(screenIn).removeClass('d-none');
//             } else {
//                 $(inputId)[0].reportValidity();
//             }
//         });
//     }

//     function handleDecalClick(contentId, screenOut, screenIn) {
//         $(contentId + ' .decalsItems').click(function () {
//             $(screenOut).addClass('d-none');
//             $(screenIn).removeClass('d-none');
//         });
//     }

//     function handleGoBackClick(buttonId, screenOut, screenIn) {
//         $(buttonId).click(function () {
//             $(screenOut).addClass('d-none');
//             $(screenIn).removeClass('d-none');
//         });
//     }

//     // Handling buttons and screens
//     handleButtonClick('#addTextButton2', '#decalText2', '#screen1', '#screen2');
//     handleButtonClick('#addTextButton3', '#decalText3', '#NumberFirstScreen', '#numberSecondScreen');
//     handleButtonClick('#addTextButton1', '#decalText1', '#nameFirstScreen', '#NameSecondScreen');

//     // Handling decals items
//     handleDecalClick('#textContent', '#screen2', '#screen3');
//     handleDecalClick('#numberContent', '#numberSecondScreen', '#NumberThirdScreen');
//     handleDecalClick('#nameContent', '#NameSecondScreen', '#NameThirdScreen');

//     // Handling go back buttons
//     handleGoBackClick('#goBackButton', '#screen3', '#screen1');
//     handleGoBackClick('#nubmerGoBack', '#NumberThirdScreen', '#NumberFirstScreen');
//     handleGoBackClick('#nameGoBack', '#NameThirdScreen', '#nameFirstScreen');
// });

// input value 
// document.addEventListener('DOMContentLoaded', () => {
//     function setupButton(buttonId, inputId, decalClass) {
//         const addTextButton = document.getElementById(buttonId);
//         const inputField = document.getElementById(inputId);
//         const decalTextElement = document.querySelector(`.textDecalMesh .${decalClass}`);

//         addTextButton.addEventListener('click', () => {
//             const inputText = inputField.value;
//             decalTextElement.textContent = inputText;
//         });
//     }

//     function setupDeleteIcon(iconClass, inputId, decalClass) {
//         const deleteIcon = document.querySelector(`.${iconClass}`);
//         const inputField = document.getElementById(inputId);
//         const decalTextElement = document.querySelector(`.textDecalMesh .${decalClass}`);

//         deleteIcon.addEventListener('click', () => {
//             inputField.value = ''; // Reset the input field
//             decalTextElement.textContent = ''; // Clear the decal text
//         });
//     }

//     // Set up all the buttons and their corresponding input fields and decal elements
//     setupButton('addTextButton2', 'decalText2', 'decalText');
//     setupButton('addTextButton3', 'decalText3', 'decalText2');
//     setupButton('addTextButton1', 'decalText1', 'decalText3');

//     // Set up delete icons
//     setupDeleteIcon('TextRemoveValue', 'decalText2', 'decalText');
//     setupDeleteIcon('NumberRemoveValue', 'decalText3', 'decalText2');
//     setupDeleteIcon('NameRemoveValue', 'decalText1', 'decalText3');
// });

 




//  preloader 
// document.addEventListener('DOMContentLoaded', () => {
//     const preloader = document.getElementById('preloader');
//     const progressBar = document.querySelector('.progress-bar');
//     const progressText = document.querySelector('.progress-text');

//     // Function to simulate loading progress
//     function simulateLoading() {
//         let progress = 0;
//         const interval = setInterval(() => {
//             progress += 10; // Increase progress by 10%
//             progressBar.style.width = progress + '%';
//             progressText.textContent = progress + '%';

//             if (progress >= 100) {
//                 clearInterval(interval);
//                 // Simulate loading completion
//                 setTimeout(() => {
//                     preloader.style.display = 'none'; // Hide the preloader
//                 }, 500); // Short delay before hiding
//             }
//         }, 500); // Update progress every 500ms
//     }

//     simulateLoading();
// });
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contents = document.querySelectorAll('.sidebar_content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');

            // Hide all contents
            contents.forEach(content => content.classList.remove('active'));

            // Show the targeted content
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});
    // document.addEventListener('DOMContentLoaded', function () {
    //     // Select all elements with the class 'models'
    //     const models = document.querySelectorAll('.models');

    //     // Select the '.selectModel' section and '.HomeMainContainer'
    //     const selectModel = document.querySelector('.selectModel');
        

    //     // Initially hide the homeMainContainer, and show selectModel
    //     homeMainContainer.style.display = 'block'; // Make sure it's hidden initially
    //     selectModel.style.display = 'block'; // Ensure selectModel is visible

    //     // Add click event listeners to each '.models' element
    //     models.forEach(model => {
    //         model.addEventListener('click', function (event) {
    //             event.preventDefault(); // Prevent default action

    //             // Hide the '.selectModel' section
    //             if (selectModel) {
    //                 homeMainContainer.style.display = 'block';
    //             }

    //             // Show the '.HomeMainContainer' (home banner)
    //             if (homeMainContainer) {
    //                 homeMainContainer.style.display = 'block';
    //             }
    //         });
    //     });
    // });
// document.addEventListener('DOMContentLoaded', () => {
//     const navItems = document.querySelectorAll('.nav-item a');
//     const contents = document.querySelectorAll('.sidebar_content');

//     navItems.forEach(item => {
//         item.addEventListener('click', () => {
//             const targetId = item.getAttribute('href').substring(1); // Remove the '#' from href

//             // Hide all contents
//             contents.forEach(content => content.classList.remove('active'));

//             // Show the targeted content
//             const targetContent = document.getElementById(targetId);
//             if (targetContent) {
//                 targetContent.classList.add('active');
//             }

//             // For mobile view: show content container
//             if (window.innerWidth <= 768) {
//                 document.querySelector('.sidebar_content').style.display = 'block';
//             }
//         });
//     });

//     // For mobile view: add event listener to hide content when clicking outside or on a close button (if needed)
//     // Example code to hide content when clicking outside (customize as needed)
//     document.addEventListener('click', (e) => {
//         if (!document.querySelector('.sidebar').contains(e.target) &&
//             !document.querySelector('.sidebar_content').contains(e.target)) {
//             document.querySelector('.sidebar_content').style.display = 'none';
//         }
//     });
// });
// document.addEventListener('DOMContentLoaded', () => {
//     const radioButtons = document.querySelectorAll('input[name="meshActiveColor"]');

//     radioButtons.forEach(radio => {
//         radio.addEventListener('change', () => {
//             // Hide all titles initially
//             document.getElementById('titlePrimary').style.display = 'none';
//             document.getElementById('titleSecondary').style.display = 'none';
//             document.getElementById('titleTertiary').style.display = 'none';

//             // Show the corresponding title based on the selected radio button
//             if (radio.value === 'primary') {
//                 document.getElementById('titlePrimary').style.display = 'block';
//             } else if (radio.value === 'secondary') {
//                 document.getElementById('titleSecondary').style.display = 'block';
//             } else if (radio.value === 'tertiary') {
//                 document.getElementById('titleTertiary').style.display = 'block';
//             }
//         });
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {
//     const fileInput = document.getElementById('fileInput');
//     const uploadForm = document.querySelector('.logoFirstScreen');
//     const decalsPlacementsMeshes = document.querySelector('.logoSecondScreen');
//     const goBackLink = document.querySelector('.backtoUpload'); // Select the "Go Back" link

//     // Handle file input change
//     fileInput.addEventListener('change', function () {
//         if (fileInput.files.length > 0) {
//             // Hide upload form and show decals placements
//             uploadForm.style.display = 'none';
//             decalsPlacementsMeshes.classList.remove('d-none');
//         } else {
//             decalsPlacementsMeshes.classList.add('d-none');
//             uploadForm.style.display = 'block';
//         }
//     });

//     // Handle "Go Back" link click
//     goBackLink.addEventListener('click', function (e) {
//         e.preventDefault(); // Prevent default link behavior
//         // Show upload form and hide decals placements
//         uploadForm.style.display = 'block';
//         decalsPlacementsMeshes.classList.add('d-none');
//     });
// });


 