const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

let courses = [];

// Read courses from JSON file
fs.readFile('courses.json', 'utf8', (err, data) => {
    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {
        courses = JSON.parse(data);
    }
});

app.get('/courses', (req, res) => {
    res.json(courses);
});

app.post('/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);

    // Write to JSON file
    fs.writeFile('courses.json', JSON.stringify(courses), err => {
        if (err) {
            console.log('Error writing file', err);
        }
    });

    res.json(course);
});

app.put('/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    course.name = req.body.name;

    // Write to JSON file
    fs.writeFile('courses.json', JSON.stringify(courses), err => {
        if (err) {
            console.log('Error writing file', err);
        }
    });

    res.json(course);
});

app.delete('/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Write to JSON file
    fs.writeFile('courses.json', JSON.stringify(courses), err => {
        if (err) {
            console.log('Error writing file', err);
        }
    });

    res.json(course);
});