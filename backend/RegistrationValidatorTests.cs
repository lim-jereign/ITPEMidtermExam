using CampusEvents.Backend;
using Moq;
using Xunit;

public class RegistrationValidatorTests
{
    [Theory]
    [InlineData("juan.delacruz@univ.edu.ph", true)]
    [InlineData("JUAN@UNIV.EDU.PH", true)]
    [InlineData("juan@gmail.com", false)]
    [InlineData("@univ.edu.ph", false)]
    [InlineData("juan@univ.edu.ph.evil.com", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void IsValidStudentEmail_ReturnsExpected(string? email, bool expected)
    {
        var validator = new RegistrationValidator(new Mock<IEventRepository>().Object);
        Assert.Equal(expected, validator.IsValidStudentEmail(email));
    }

    [Theory]
    [InlineData(100, 99, true)]
    [InlineData(100, 100, false)]
    [InlineData(100, 101, false)]
    public void HasAvailableSeat_UsesMockedRepository(int capacity, int registered, bool expected)
    {
        var repo = new Mock<IEventRepository>();
        repo.Setup(r => r.GetCapacity(1)).Returns(capacity);
        repo.Setup(r => r.GetRegisteredCount(1)).Returns(registered);

        var validator = new RegistrationValidator(repo.Object);

        Assert.Equal(expected, validator.HasAvailableSeat(1));
        repo.Verify(r => r.GetCapacity(1), Times.Once);
    }
}