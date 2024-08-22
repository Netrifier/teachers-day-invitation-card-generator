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
    const teacherImage = getTeacherImage(
      `./images/${teacher.group}/${teacher.group}-${teacher.id}.jpg`
    );
    if (!teacherImage) {
      imageNotFoundTeachers.push(teacher);
      return;
    }

    // Generate svg
    const svg = generateSVG({
      group: teacher.group,
      id: teacher.id,
      name: teacher.name,
      teacherImage: teacherImage,
    });

    // Convert svg to tiff
    sharp(Buffer.from(svg, "utf-8"), { density: 1000 })
      .tiff({ quality: 100, compression: "lzw" })
      .toFile(`generated/tiff/${teacher.group}-${teacher.id}.tiff`)
      .then(
        () => (
          console.log(
            `TIFF Generated ${teacher.group}-${teacher.id} ${teacher.name}`
          ),
          generatedCard++
        )
      );

    // Convert svg to png
    sharp(Buffer.from(svg, "utf-8"), { density: 1000 })
      .png()
      .toFile(`generated/png/${teacher.group}-${teacher.id}.png`)
      .then(
        () => (
          console.log(
            `PNG Generated ${teacher.group}-${teacher.id} ${teacher.name}`
          ),
          generatedCard++
        )
      );

    // Directly write svg to file
    fs.writeFile(
      `generated/svg/${teacher.group}-${teacher.id}.svg`,
      svg,
      (err) => {
        console.log(
          `SVG Generated ${teacher.group}-${teacher.id} ${teacher.name}`
        );
      }
    );
  })
);

imageNotFoundTeachers.forEach((teacher) =>
  console.log(`NO IMAGE FOUND ${teacher.group}-${teacher.id} ${teacher.name}`)
);

console.log("\n", `(Not generated ${imageNotFoundTeachers.length} cards)`);
