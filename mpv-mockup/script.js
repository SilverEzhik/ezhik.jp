var menu = [
    {
        name: "Open local file", 
        fun: function() {
            var input = document.createElement('input');
            input.type = 'file';
            input.click();
        }
    },
    {
        name: "Open URL", 
    },
    { 
        name: "",
        disable: true
    },
    {
        name: "Resume"
    },
    {
        name: "Previous"
    },
    {
        name: "Next"
    },
    { 
        name: "",
        disable: true
    },
    {
        name: "Screenshot"
    },
    {
        name: "Screenshot without subtitles"
    }, 
    { 
        name: "",
        disable: true
    },
    {
        name: "Playback speed",
            subMenu: [
                { 
                    name: "1%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "10%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "15%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "25%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "33%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "50%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "66%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "75%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "100%",
                    img: "radio-selected.png"
                },
                { 
                    name: "125%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "150%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "200%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "250%",
                    img: "radio-deselected.png"
                },
                { 
                    name: "300%",
                    img: "radio-deselected.png"
                }
    ]
},
    {
        name: "Loop",
            subMenu: [
                { 
                    name: "No loop",
                    img: "radio-selected.png"
                },
                { 
                    name: "Loop current file",
                    img: "radio-deselected.png"
                },
                { 
                    name: "Loop playlist",
                    img: "radio-deselected.png"
                }
            ]
    },
    { 
        name: "",
        disable: true
    },
    { 
        name: "Stay on top",
        img: "checkbox.png"
    },
    {
        name: "Window size",
            subMenu: [
                { name: "1/2" },
                { name: "Original size" },
                { name: "2x size" },
                { 
                    name: "Full screen",
                    img: "checkbox.png"
                }
            ]
    },
    { 
        name: "",
        disable: true
    },
    {
        name: "Video options",
        subMenu: [
            { 
                name: "Video tracks",
                subMenu: [
                    {
                        name: "None",
                        img: "radio-deselected.png"
                    },
                    {
                        name: "(1) jpn (\"K-ON!! - Ending 2\")",
                        img: "radio-selected.png"
                    }
                ]
            },
            { 
                name: "Subtitle tracks",
                subMenu: [
                    {
                        name: "None",
                        img: "radio-deselected.png"
                    },
                    {
                        name: "(1) eng (\"English Subtitles\")",
                        img: "radio-selected.png"
                    }
                ]
            },
            { 
                name: "",
                disable: true
            },
            {
                name: "Deinterlace",
                img: "checkbox.png"
            },
            {
                name: "VSFilter compatibility mode",
                img: "checkbox.png"
            },
            {
                name: "Aspect ratio",
                    subMenu: [
                        { 
                            name: "Original",
                            img: "radio-selected.png"
                        },
                        {  
                            name: "1:1",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "5:4",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "4:3",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "16:9",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "2.35:1",
                            img: "radio-deselected.png"
                        }
                    ]
            },
            {
                name: "Pan & Scan",
                    subMenu: [
                        { 
                            name: "0.000",
                            img: "radio-selected.png"
                        },
                        { 
                            name: "0.100",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "0.200",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "0.300",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "0.400",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "0.500",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "0.600",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "0.700",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "0.800",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "0.900",
                            img: "radio-deselected.png"
                        },
                        { 
                            name: "1.000",
                            img: "radio-deselected.png"
                        }
                    ]
            },
            { 
                name: "",
                disable: true
            },
            {
                name: "Contrast",
                subMenu: [
                    { 
                        name: "-100",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-90",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-80",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-70",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-60",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-50",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-40",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-30",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-20",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-10",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "0",
                        img: "radio-selected.png"
                    },
                    { 
                        name: "10",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "20",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "30",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "40",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "50",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "60",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "70",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "80",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "90",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "100",
                        img: "radio-deselected.png"
                    }
                ]
            },
            {
                name: "Brightness",
                subMenu: [
                    { 
                        name: "-100",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-90",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-80",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-70",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-60",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-50",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-40",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-30",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-20",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-10",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "0",
                        img: "radio-selected.png"
                    },
                    { 
                        name: "10",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "20",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "30",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "40",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "50",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "60",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "70",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "80",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "90",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "100",
                        img: "radio-deselected.png"
                    }
                ]
            },
            {
                name: "Gamma",
                subMenu: [
                    { 
                        name: "-100",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-90",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-80",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-70",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-60",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-50",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-40",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-30",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-20",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-10",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "0",
                        img: "radio-selected.png"
                    },
                    { 
                        name: "10",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "20",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "30",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "40",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "50",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "60",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "70",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "80",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "90",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "100",
                        img: "radio-deselected.png"
                    }
                ]
            },
            {
                name: "Saturation",
                subMenu: [
                    { 
                        name: "-100",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-90",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-80",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-70",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-60",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-50",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-40",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-30",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-20",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "-10",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "0",
                        img: "radio-selected.png"
                    },
                    { 
                        name: "10",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "20",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "30",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "40",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "50",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "60",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "70",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "80",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "90",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "100",
                        img: "radio-deselected.png"
                    }
                ]
            }
        ]
    },
    {
        name: "Audio options",
        subMenu: [
            {
                name: "Volume",
                subMenu: [
                    { 
                        name: "Mute audio",
                        img: "checkbox.png"
                    },
                    { 
                        name: "0%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "10%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "20%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "30%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "40%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "50%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "60%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "70%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "80%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "90%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "100%",
                        img: "radio-selected.png"
                    },
                    { 
                        name: "110%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "120%",
                        img: "radio-deselected.png"
                    },
                    { 
                        name: "130%",
                        img: "radio-deselected.png"
                    }
                ]
            },
            { 
                name: "Audio tracks",
                subMenu: [
                    {
                        name: "None",
                        img: "radio-deselected.png"
                    },
                    {
                        name: "(1) jpn (\"Japanese Audio\")",
                        img: "radio-selected.png"
                    }
                ]
            }
        ]
    },
    { 
        name: "",
        disable: true
    },
    {
        name: "Quit...",
        subMenu: [
            {
                name: "Save playback position and quit"
            },
            {
                name: "Quit without saving"
            }
        ]
    }
]

$(".window-content").contextMenu(menu,{triggerOn:'contextmenu'});
