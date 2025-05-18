using CarRentalAggregator.Domain.Enums;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;


namespace CarRentalAggregator.Application.Serialization
{
    public class EngineTypeSerializer : JsonConverter<EngineTypes>
    {
        public override EngineTypes Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = reader.GetString();
            return value switch
            {
                "Inline four" => EngineTypes.inline_four,
                "Inline six" => EngineTypes.inline_six,
                "V6" => EngineTypes.V6,
                "V8" => EngineTypes.V8,
                "V10" => EngineTypes.V10,
                "V12" => EngineTypes.V12,
                "W16" => EngineTypes.W16,
                _ => throw new JsonException($"Unknown engine type: {value}")
            };
        }

        public override void Write(Utf8JsonWriter writer, EngineTypes value, JsonSerializerOptions options)
        {
            var stringValue = value switch
            {
                EngineTypes.inline_four => "Inline four",
                EngineTypes.inline_six => "Inline six",
                EngineTypes.V6 => "V6",
                EngineTypes.V8 => "V8",
                EngineTypes.V10 => "V10",
                EngineTypes.V12 => "V12",
                EngineTypes.W16 => "W16",
                _ => throw new JsonException($"Unknown engine type: {value}")
            };

            writer.WriteStringValue(stringValue);
        }
    }
}
