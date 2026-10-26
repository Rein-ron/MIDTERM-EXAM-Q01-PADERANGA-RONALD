const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname)); 

let vehicles = require('./data.json');

app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.get('/api/vehicles/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = vehicles.find(item => item.id === id);
  if (!found) {
    return res.status(404).json({ message: "id not found" });
  }
  res.json(found);
});

app.post("/api/vehicles", (req, res) => {
    const { plate_number, owner, vehicle_type, color } = req.body;
    if (!plate_number || !owner || !vehicle_type || !color) {
        return res.status(400).json({ message: "plate_number, owner, vehicle_type, and color are required" });
    }

    const Plate_number = String(plate_number).trim();
    const Owner = String(owner).trim();
    const Vehicle_type = String(vehicle_type).trim();
    const Color = String(color).trim();

    if (!Plate_number || !Owner || !Vehicle_type || !Color) {
        return res.status(400).json({ message: "plate_number, owner, vehicle_type, and color must be valid" });
  }

  
  const existingVehicle = vehicles.find(v => v.plate_number === Plate_number);
    if (existingVehicle) {
        return res.status(400).json({ message: "plate_number already exists" });
  }

  const NewVehicle = {
        id: vehicles.length === 0 ? 1 : Math.max(...vehicles.map(v => v.id)) + 1,
        plate_number: Plate_number,
        owner: Owner,
        vehicle_type: Vehicle_type,
        color: Color,
  };

  vehicles.push(NewVehicle);
    fs.writeFileSync('./data.json', JSON.stringify(vehicles, null, 2));
    res.status(201).json(NewVehicle);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
