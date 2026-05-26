using System;

namespace LibraryManagement.Core.Exceptions;

public class CardExpiredException : Exception
{
    public CardExpiredException(string message) : base(message) { }
}
