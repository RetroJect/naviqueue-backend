import { BadRequestException, PipeTransform } from '@nestjs/common';

// Parses a JSON string into the requested type, throwing on error
export class JSONParsePipe<T> implements PipeTransform<string, T> {
  transform(value: string): T {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed: T = JSON.parse(value);
      return parsed;
    } catch (error) {
      console.error(`Failed to parse JSON ${value} from string`, error);
      throw new BadRequestException('Unable to parse provided string as JSON');
    }
  }
}
