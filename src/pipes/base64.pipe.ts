import {
  ArgumentMetadata,
  BadRequestException,
  Logger,
  Optional,
  PipeTransform,
} from '@nestjs/common';

export interface Base64DecodePipeOptions {
  /**
   * If true, the pipe will return undefined
   * @default false
   */
  optional?: boolean;
}

// Decodes a base64 string
export class Base64DecodePipe implements PipeTransform<string, string> {
  private readonly logger = new Logger(Base64DecodePipe.name);

  constructor(
    @Optional() protected readonly options?: Base64DecodePipeOptions,
  ) {
    options = options || { optional: false };
  }

  transform(value: string, metadata: ArgumentMetadata) {
    if (!value && this.options?.optional) return value;

    try {
      return Buffer.from(value, 'base64').toString();
    } catch (error) {
      this.logger.error('Unable to decode provided string as base64', error);

      throw new BadRequestException({
        success: false,
        message: `Base64 decode failed for ${metadata.type} ${metadata.data ?? 'parameter'}`,
      });
    }
  }
}
