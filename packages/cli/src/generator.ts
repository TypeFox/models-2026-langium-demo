import { isStruct, type Model } from 'hello-world-language';
import { MultiMap } from 'langium';
import { expandToNode, joinToNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './util.js';

export function generateTypeScript(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.ts`;

    // struct name => all its property names
    const structIR = new MultiMap<string, string>();
    for (const struct of model.statements.filter(isStruct)) {
        for (const property of struct.properties) {
            if (!structIR.has(struct.name, property.name)) {
                structIR.add(struct.name, property.name);
            }
        }
    }

    const fileNode = expandToNode`
        // auto-generated

        ${joinToNode(
            structIR.entriesGroupedByKey(),
            greeting => expandToNode`
                export type ${greeting[0]} = {
                    ${joinToNode(greeting[1].sort(), property => `${property}: number;`, { appendNewLineIfNotEmpty: true })}
                }
            `,
            { appendNewLineIfNotEmpty: 2, skipNewLineAfterLastItem: true }
        )}
    `.appendNewLineIfNotEmpty();

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}
