using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarRentalAggregator.Migrations
{
    /// <inheritdoc />
    public partial class AddRentStatusAndTotalPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Rents",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPrice",
                table: "Rents",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Rents_CarId",
                table: "Rents",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_Rents_CompanyId",
                table: "Rents",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Rents_UserId",
                table: "Rents",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rents_Cars_CarId",
                table: "Rents",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rents_Companies_CompanyId",
                table: "Rents",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rents_Users_UserId",
                table: "Rents",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rents_Cars_CarId",
                table: "Rents");

            migrationBuilder.DropForeignKey(
                name: "FK_Rents_Companies_CompanyId",
                table: "Rents");

            migrationBuilder.DropForeignKey(
                name: "FK_Rents_Users_UserId",
                table: "Rents");

            migrationBuilder.DropIndex(
                name: "IX_Rents_CarId",
                table: "Rents");

            migrationBuilder.DropIndex(
                name: "IX_Rents_CompanyId",
                table: "Rents");

            migrationBuilder.DropIndex(
                name: "IX_Rents_UserId",
                table: "Rents");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Rents");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "Rents");
        }
    }
}
