import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

// Decodes a base64 string
export class Base64DecodePipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    try {
      return Buffer.from(value, 'base64').toString();
    } catch (error) {
      console.error('Unable to decode provided string as base64', error);
      throw new BadRequestException(
        `Base64 decode failed for ${metadata.type} ${metadata.data ?? 'parameter'}`,
      );
    }
  }
}
