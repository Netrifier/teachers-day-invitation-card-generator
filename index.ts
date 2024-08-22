import fs from "node:fs";
import sharp from "sharp";

import { data } from "./data";
import { generateSVG } from "./generateSVG";

const getTeacherImage = (filePath: string) => {
  try {
    const teacherImage =
      "data:image/jpeg;base64," +
      fs.readFileSync(filePath, { encoding: "base64" });
    return teacherImage;
  } catch (error) {
    return null;
  }
};

let generatedCard = 0;

const imageNotFoundTeachers: {
  group: number;
  id: number;
  name: string;
}[] = [];

data.forEach((group) =>
  group.forEach((teacher) => {
    console.log(`${teacher.group}-${teacher.id} ${teacher.name}`);
    const teacherImage = getTeacherImage(
      `./images/${teacher.group}/${teacher.group}-${teacher.id}.jpg`
    );
    if (!teacherImage) {
      imageNotFoundTeachers.push(teacher);
      return;
    }
    const svg = generateSVG({
      group: teacher.group,
      id: teacher.id,
      name: teacher.name,
      teacherImage: teacherImage,
    });

    // Convert svg to png
    sharp(Buffer.from(svg, "utf-8"), { density: 1000 })
      .png()
      .toFile(`generatedpng/${teacher.group}-${teacher.id}.png`);

    // Directly write svg to file
    // fs.writeFileSync(
    //   `generated/${teacher.group}-${teacher.id}.svg`,
    //   svg,
    //   "utf-8"
    // );
    generatedCard++;
  })
);

imageNotFoundTeachers.forEach((teacher) =>
  console.log(`NO IMAGE FOUND ${teacher.group}-${teacher.id} ${teacher.name}`)
);

console.log(
  "\n",
  `(Generated ${generatedCard} cards)`,
  `(Not generated ${imageNotFoundTeachers.length} cards)`
);
